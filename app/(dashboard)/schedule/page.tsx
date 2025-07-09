"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, addDays, addWeeks, subWeeks } from "date-fns";
import { DayOfWeek } from "@/lib/types";

const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayLabels = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};

const timeSlots = [
  '07:00-14:00',
  '10:00-17:00',
  '14:00-22:00',
  '16:00-22:00'
];

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToCurrentWeek = () => setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <p className="mt-2 text-gray-600">
          View and manage weekly shift schedules
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousWeek}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold">
            {format(currentWeek, 'MMM d')} - {format(addDays(currentWeek, 6), 'MMM d, yyyy')}
          </h2>
          <button
            onClick={goToNextWeek}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={goToCurrentWeek}
            className="ml-4 text-sm text-blue-600 hover:text-blue-800"
          >
            Today
          </button>
        </div>
        <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Generate Schedule
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="grid grid-cols-8 gap-0">
          <div className="bg-gray-50 p-3 text-sm font-semibold text-gray-900">
            Time
          </div>
          {days.map((day) => (
            <div
              key={day}
              className="bg-gray-50 p-3 text-center text-sm font-semibold text-gray-900 border-l border-gray-200"
            >
              <div>{dayLabels[day]}</div>
              <div className="text-xs font-normal text-gray-500 mt-1">
                {format(addDays(currentWeek, days.indexOf(day)), 'MMM d')}
              </div>
            </div>
          ))}
        </div>

        {timeSlots.map((slot) => (
          <div key={slot} className="grid grid-cols-8 gap-0 border-t border-gray-200">
            <div className="p-3 text-sm text-gray-900 bg-gray-50">
              {slot}
            </div>
            {days.map((day) => (
              <div
                key={`${day}-${slot}`}
                className="min-h-[100px] border-l border-gray-200 p-2 hover:bg-gray-50"
              >
                <div className="text-xs text-gray-500">
                  No assignments
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">No schedule created</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Click "Generate Schedule" to create an AI-optimized schedule for this week.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}