import { Employee, Schedule, ScheduledShift, ValidationError } from '@/lib/types';
import { MINIMUM_STAFF_REQUIREMENTS, MINIMUM_REST_HOURS } from '@/data/rules/shiftRules';
import { differenceInHours, parseISO, startOfDay, addHours } from 'date-fns';

export function validateSchedule(schedule: Schedule, employees: Employee[]): ValidationError[] {
  const errors: ValidationError[] = [];

  const employeeMap = new Map(employees.map(emp => [emp.id, emp]));
  const employeeHours = new Map<string, number>();
  const employeeShifts = new Map<string, ScheduledShift[]>();

  schedule.shifts.forEach(shift => {
    validateMinimumStaff(shift, employeeMap, errors);
    
    shift.assignedEmployees.forEach(empId => {
      const currentHours = employeeHours.get(empId) || 0;
      const shiftHours = calculateShiftHours(shift.startTime, shift.endTime);
      employeeHours.set(empId, currentHours + shiftHours);
      
      const shifts = employeeShifts.get(empId) || [];
      shifts.push(shift);
      employeeShifts.set(empId, shifts);
    });
  });

  validateEmployeeHours(employeeHours, employeeMap, errors);
  validateDoubleBooking(employeeShifts, errors);
  validateRestTime(employeeShifts, errors);

  return errors;
}

function validateMinimumStaff(
  shift: ScheduledShift,
  employeeMap: Map<string, Employee>,
  errors: ValidationError[]
): void {
  let lederCount = 0;
  let ungarbejderCount = 0;

  shift.assignedEmployees.forEach(empId => {
    const employee = employeeMap.get(empId);
    if (employee) {
      if (employee.type === 'leder') lederCount++;
      else ungarbejderCount++;
    }
  });

  if (lederCount < MINIMUM_STAFF_REQUIREMENTS.leder) {
    errors.push({
      shiftId: shift.id,
      type: 'minimum_staff',
      message: `Shift requires at least ${MINIMUM_STAFF_REQUIREMENTS.leder} leder, but only has ${lederCount}`,
      severity: 'error'
    });
  }

  if (ungarbejderCount < MINIMUM_STAFF_REQUIREMENTS.ungarbejder) {
    errors.push({
      shiftId: shift.id,
      type: 'minimum_staff',
      message: `Shift requires at least ${MINIMUM_STAFF_REQUIREMENTS.ungarbejder} ungarbejder, but only has ${ungarbejderCount}`,
      severity: 'error'
    });
  }

  if (shift.assignedEmployees.length < shift.requiredStaff.total) {
    errors.push({
      shiftId: shift.id,
      type: 'staff_requirement',
      message: `Shift requires ${shift.requiredStaff.total} employees, but only has ${shift.assignedEmployees.length}`,
      severity: 'error'
    });
  }

  if (lederCount < shift.requiredStaff.leder) {
    errors.push({
      shiftId: shift.id,
      type: 'staff_requirement',
      message: `Shift requires ${shift.requiredStaff.leder} leder, but only has ${lederCount}`,
      severity: 'warning'
    });
  }

  if (ungarbejderCount < shift.requiredStaff.ungarbejder) {
    errors.push({
      shiftId: shift.id,
      type: 'staff_requirement',
      message: `Shift requires ${shift.requiredStaff.ungarbejder} ungarbejder, but only has ${ungarbejderCount}`,
      severity: 'warning'
    });
  }
}

function validateEmployeeHours(
  employeeHours: Map<string, number>,
  employeeMap: Map<string, Employee>,
  errors: ValidationError[]
): void {
  employeeHours.forEach((hours, empId) => {
    const employee = employeeMap.get(empId);
    if (employee && hours > employee.weeklyHours) {
      errors.push({
        shiftId: '',
        type: 'employee_hours',
        message: `${employee.name} is scheduled for ${hours} hours, exceeding their weekly limit of ${employee.weeklyHours} hours`,
        severity: 'error'
      });
    }
  });
}

function validateDoubleBooking(
  employeeShifts: Map<string, ScheduledShift[]>,
  errors: ValidationError[]
): void {
  employeeShifts.forEach((shifts, empId) => {
    for (let i = 0; i < shifts.length; i++) {
      for (let j = i + 1; j < shifts.length; j++) {
        if (shiftsOverlap(shifts[i], shifts[j])) {
          errors.push({
            shiftId: shifts[j].id,
            type: 'double_booking',
            message: `Employee is double-booked between shifts`,
            severity: 'error'
          });
        }
      }
    }
  });
}

function validateRestTime(
  employeeShifts: Map<string, ScheduledShift[]>,
  errors: ValidationError[]
): void {
  employeeShifts.forEach((shifts) => {
    const sortedShifts = [...shifts].sort((a, b) => {
      if (a.day !== b.day) return 0;
      return a.startTime.localeCompare(b.startTime);
    });

    for (let i = 0; i < sortedShifts.length - 1; i++) {
      const endTime = parseTime(sortedShifts[i].endTime);
      const nextStartTime = parseTime(sortedShifts[i + 1].startTime);
      const restHours = differenceInHours(nextStartTime, endTime);

      if (restHours < MINIMUM_REST_HOURS) {
        errors.push({
          shiftId: sortedShifts[i + 1].id,
          type: 'rest_time',
          message: `Less than ${MINIMUM_REST_HOURS} hours rest between shifts`,
          severity: 'error'
        });
      }
    }
  });
}

function calculateShiftHours(startTime: string, endTime: string): number {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  return differenceInHours(end, start);
}

function parseTime(time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const date = startOfDay(new Date());
  return addHours(date, hours + minutes / 60);
}

function shiftsOverlap(shift1: ScheduledShift, shift2: ScheduledShift): boolean {
  if (shift1.day !== shift2.day) return false;
  
  return (
    (shift1.startTime < shift2.endTime && shift1.endTime > shift2.startTime) ||
    (shift2.startTime < shift1.endTime && shift2.endTime > shift1.startTime)
  );
}

export function canAssignEmployee(
  employee: Employee,
  shift: ScheduledShift,
  currentSchedule: Schedule
): { valid: boolean; reason?: string } {
  const tempSchedule: Schedule = {
    ...currentSchedule,
    shifts: currentSchedule.shifts.map(s =>
      s.id === shift.id
        ? { ...s, assignedEmployees: [...s.assignedEmployees, employee.id] }
        : s
    )
  };

  const errors = validateSchedule(tempSchedule, [employee]);
  
  if (errors.length > 0) {
    return { valid: false, reason: errors[0].message };
  }
  
  return { valid: true };
}