"use client";

import { useEmployeeStore, useScheduleStore } from "@/lib/store";
import { PageTransition, FadeIn, SlideIn } from "@/components/layout/page-transition";

export default function DashboardPage() {
  const { employees } = useEmployeeStore();
  const { currentSchedule } = useScheduleStore();

  const totalShifts = currentSchedule?.shifts.length || 0;
  const filledShifts = currentSchedule?.shifts.filter(shift => shift.assignedEmployees.length > 0).length || 0;
  const fillPercentage = totalShifts > 0 ? Math.round((filledShifts / totalShifts) * 100) : 0;

  return (
    <PageTransition>
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to Netto Scheduler. Manage your employee shifts efficiently.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SlideIn delay={0.1}>
          <div className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Employees
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">{employees.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </SlideIn>

        <SlideIn delay={0.2}>
          <div className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      This Week&apos;s Shifts
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">{totalShifts}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </SlideIn>

        <SlideIn delay={0.3}>
          <div className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Shifts Filled
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">{fillPercentage}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </SlideIn>
      </div>

      <FadeIn delay={0.4}>
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
              Create Schedule
            </button>
            <button className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
              Add Employee
            </button>
            <button className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
              View Reports
            </button>
          </div>
        </div>
      </FadeIn>
    </PageTransition>
  );
}