import { Employee, Schedule } from '@/lib/types';

export interface OpenAIResponse {
  message: string;
  schedule?: {
    shifts: Array<{
      day: string;
      startTime: string;
      endTime: string;
      assignedEmployees: string[];
    }>;
  };
  error?: string;
}

export async function generateScheduleWithAI(
  message: string,
  employees: Employee[],
  currentSchedule: Schedule | null,
  apiKey: string
): Promise<OpenAIResponse> {
  try {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        employees,
        currentSchedule,
        apiKey,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate schedule');
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return {
      message: 'Sorry, I encountered an error while generating the schedule. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export function convertAIScheduleToSchedule(
  aiSchedule: OpenAIResponse['schedule'],
  baseSchedule: Schedule
): Schedule {
  if (!aiSchedule || !aiSchedule.shifts) {
    return baseSchedule;
  }

  const updatedShifts = baseSchedule.shifts.map(shift => {
    const aiShift = aiSchedule.shifts.find(s => 
      s.day === shift.day && 
      s.startTime === shift.startTime && 
      s.endTime === shift.endTime
    );

    if (aiShift) {
      return {
        ...shift,
        assignedEmployees: aiShift.assignedEmployees
      };
    }

    return shift;
  });

  return {
    ...baseSchedule,
    shifts: updatedShifts,
    updatedAt: new Date()
  };
}