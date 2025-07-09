import { Schedule, Shift, ScheduledShift, DayOfWeek } from '@/lib/types';
import { getShiftRulesForDay } from '@/data/rules/shiftRules';
import { startOfWeek, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export function generateEmptySchedule(weekStart: Date): Schedule {
  const shifts: ScheduledShift[] = [];
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  days.forEach(day => {
    const shiftRules = getShiftRulesForDay(day);
    
    shiftRules.shifts.forEach(shiftRule => {
      shifts.push({
        id: uuidv4(),
        day,
        startTime: shiftRule.startTime,
        endTime: shiftRule.endTime,
        requiredStaff: shiftRule.requiredStaff,
        assignedEmployees: []
      });
    });
  });

  return {
    id: uuidv4(),
    weekStart: startOfWeek(weekStart, { weekStartsOn: 1 }),
    shifts,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function formatShiftTime(shift: Shift): string {
  return `${shift.startTime} - ${shift.endTime}`;
}

export function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
}

export function getShiftsForDay(schedule: Schedule, day: DayOfWeek): ScheduledShift[] {
  return schedule.shifts
    .filter(shift => shift.day === day)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function countEmployeeShifts(schedule: Schedule, employeeId: string): number {
  return schedule.shifts.filter(shift => 
    shift.assignedEmployees.includes(employeeId)
  ).length;
}

export function countEmployeeHours(schedule: Schedule, employeeId: string): number {
  return schedule.shifts
    .filter(shift => shift.assignedEmployees.includes(employeeId))
    .reduce((total, shift) => {
      const [startHour, startMin] = shift.startTime.split(':').map(Number);
      const [endHour, endMin] = shift.endTime.split(':').map(Number);
      const hours = (endHour + endMin / 60) - (startHour + startMin / 60);
      return total + hours;
    }, 0);
}