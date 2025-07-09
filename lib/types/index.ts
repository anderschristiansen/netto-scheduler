export type EmployeeType = 'leder' | 'ungarbejder';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Employee {
  id: string;
  name: string;
  age: number;
  type: EmployeeType;
  weeklyHours: number;
  availability?: Availability[];
}

export interface Availability {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface Shift {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  requiredStaff: {
    leder: number;
    ungarbejder: number;
    total: number;
  };
}

export interface ScheduledShift extends Shift {
  assignedEmployees: string[];
}

export interface Schedule {
  id: string;
  weekStart: Date;
  shifts: ScheduledShift[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShiftRule {
  id: string;
  dayType: 'weekday' | 'weekend';
  shifts: Omit<Shift, 'id' | 'day'>[];
}

export interface ValidationError {
  shiftId: string;
  type: 'minimum_staff' | 'employee_hours' | 'double_booking' | 'rest_time' | 'staff_requirement';
  message: string;
  severity: 'error' | 'warning';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  scheduleVersion?: number;
}