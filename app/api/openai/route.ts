import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Employee, Schedule, ScheduledShift } from '@/lib/types';
import { generateEmptySchedule } from '@/lib/utils/schedule';
import { validateSchedule } from '@/lib/utils/validation';
import { 
  WEEKDAY_SHIFT_RULES, 
  WEEKEND_SHIFT_RULES, 
  WEEKDAYS, 
  WEEKEND_DAYS 
} from '@/data/rules/shiftRules';

const SYSTEM_PROMPT = `You are an AI assistant that helps create optimal shift schedules for a Danish Netto store. 

STORE RULES:
- Open daily 07:00-22:00
- Two employee types: "leder" (18+) and "ungarbejder" (under 18)
- Always minimum 1 leder and 1 ungarbejder per shift
- Weekdays (Mon-Fri): 07:00-16:00 (3 employees), 16:00-22:00 (3 employees)
- Weekends (Sat-Sun): 07:00-14:00 (2 leder, 1 ungarbejder), 10:00-17:00 (1 ungarbejder), 14:00-22:00 (3 employees)
- Respect weekly hour limits for each employee
- Minimum 11 hours rest between shifts
- No double-booking

RESPONSE FORMAT:
Always respond with a JSON object containing:
{
  "message": "Your explanation of the schedule decisions",
  "schedule": {
    "shifts": [
      {
        "day": "monday|tuesday|...",
        "startTime": "HH:MM",
        "endTime": "HH:MM", 
        "assignedEmployees": ["employee_id1", "employee_id2"]
      }
    ]
  }
}

Be conversational and explain your scheduling decisions. If asked to modify a schedule, provide the updated schedule with explanations.`;

export async function POST(request: NextRequest) {
  try {
    const { message, employees, currentSchedule, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key is required' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });

    // Prepare context for the AI
    const employeeContext = employees.map((emp: Employee) => 
      `${emp.name} (${emp.type}, ${emp.age}y, ${emp.weeklyHours}h/week)`
    ).join('\n');

    const scheduleContext = currentSchedule 
      ? `Current schedule: ${JSON.stringify(currentSchedule, null, 2)}`
      : 'No current schedule';

    const userMessage = `
EMPLOYEES:
${employeeContext}

${scheduleContext}

USER REQUEST: ${message}

Please create or modify the schedule according to the request and store rules.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Try to parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (error) {
      // If JSON parsing fails, return the raw response
      return NextResponse.json({
        message: aiResponse,
        schedule: null
      });
    }

    // Validate the proposed schedule if provided
    if (parsedResponse.schedule) {
      const proposedSchedule = createScheduleFromAI(parsedResponse.schedule, employees);
      const validationErrors = validateSchedule(proposedSchedule, employees);
      
      if (validationErrors.length > 0) {
        parsedResponse.message += '\n\nValidation warnings:\n' + 
          validationErrors.map(err => `- ${err.message}`).join('\n');
      }
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate schedule' },
      { status: 500 }
    );
  }
}

function createScheduleFromAI(aiSchedule: any, employees: Employee[]): Schedule {
  const baseSchedule = generateEmptySchedule(new Date());
  
  // Map AI response to our schedule format
  const updatedShifts = baseSchedule.shifts.map(shift => {
    const aiShift = aiSchedule.shifts?.find((s: any) => 
      s.day === shift.day && s.startTime === shift.startTime && s.endTime === shift.endTime
    );
    
    if (aiShift) {
      return {
        ...shift,
        assignedEmployees: aiShift.assignedEmployees || []
      };
    }
    
    return shift;
  });

  return {
    ...baseSchedule,
    shifts: updatedShifts
  };
}