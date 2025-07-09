import { ShiftRule, DayOfWeek } from '@/lib/types';

export const STORE_HOURS = {
  open: '07:00',
  close: '22:00'
} as const;

export const WEEKDAY_SHIFT_RULES: ShiftRule = {
  id: 'weekday-rules',
  dayType: 'weekday',
  shifts: [
    {
      startTime: '07:00',
      endTime: '16:00',
      requiredStaff: {
        leder: 1,
        ungarbejder: 2,
        total: 3
      }
    },
    {
      startTime: '16:00',
      endTime: '22:00',
      requiredStaff: {
        leder: 1,
        ungarbejder: 2,
        total: 3
      }
    }
  ]
};

export const WEEKEND_SHIFT_RULES: ShiftRule = {
  id: 'weekend-rules',
  dayType: 'weekend',
  shifts: [
    {
      startTime: '07:00',
      endTime: '14:00',
      requiredStaff: {
        leder: 2,
        ungarbejder: 1,
        total: 3
      }
    },
    {
      startTime: '10:00',
      endTime: '17:00',
      requiredStaff: {
        leder: 0,
        ungarbejder: 1,
        total: 1
      }
    },
    {
      startTime: '14:00',
      endTime: '22:00',
      requiredStaff: {
        leder: 1,
        ungarbejder: 2,
        total: 3
      }
    }
  ]
};

export const MINIMUM_STAFF_REQUIREMENTS = {
  leder: 1,
  ungarbejder: 1
} as const;

export const MINIMUM_REST_HOURS = 11;

export const WEEKDAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
export const WEEKEND_DAYS: DayOfWeek[] = ['saturday', 'sunday'];

export function isWeekday(day: DayOfWeek): boolean {
  return WEEKDAYS.includes(day);
}

export function isWeekend(day: DayOfWeek): boolean {
  return WEEKEND_DAYS.includes(day);
}

export function getShiftRulesForDay(day: DayOfWeek): ShiftRule {
  return isWeekday(day) ? WEEKDAY_SHIFT_RULES : WEEKEND_SHIFT_RULES;
}