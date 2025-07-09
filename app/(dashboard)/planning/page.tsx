"use client";

import { useState } from "react";
import { Send, AlertCircle } from "lucide-react";
import { useEmployeeStore, useScheduleStore, useChatStore, useSettingsStore } from "@/lib/store";
import { generateScheduleWithAI, convertAIScheduleToSchedule } from "@/lib/utils/openai";
import { generateEmptySchedule } from "@/lib/utils/schedule";
import { startOfWeek } from "date-fns";

export default function PlanningPage() {
  const [message, setMessage] = useState("");
  const { employees } = useEmployeeStore();
  const { currentSchedule, setCurrentSchedule } = useScheduleStore();
  const { messages, addMessage, isLoading, setLoading } = useChatStore();
  const { openAIKey, isConfigured } = useSettingsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    if (!isConfigured()) {
      addMessage({
        role: "system",
        content: "Please configure your OpenAI API key in Settings before using the planning assistant."
      });
      return;
    }

    if (employees.length === 0) {
      addMessage({
        role: "system", 
        content: "Please add some employees first before generating schedules."
      });
      return;
    }

    // Add user message
    addMessage({ role: "user", content: message });
    setMessage("");
    setLoading(true);

    try {
      const response = await generateScheduleWithAI(
        message,
        employees,
        currentSchedule,
        openAIKey
      );

      // Add AI response message
      addMessage({
        role: "assistant",
        content: response.message,
        scheduleVersion: currentSchedule?.version
      });

      // If AI provided a schedule, update the current schedule
      if (response.schedule) {
        let updatedSchedule = currentSchedule;
        
        if (!updatedSchedule) {
          updatedSchedule = generateEmptySchedule(startOfWeek(new Date(), { weekStartsOn: 1 }));
        }

        const newSchedule = convertAIScheduleToSchedule(response.schedule, updatedSchedule);
        setCurrentSchedule(newSchedule);
      }

    } catch (error) {
      addMessage({
        role: "system",
        content: "Sorry, I encountered an error. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 pr-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Planning Assistant</h1>
          <p className="mt-2 text-gray-600">
            Chat with AI to create and modify schedules
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="h-[600px] overflow-y-auto p-4">
            {!isConfigured() && (
              <div className="mb-4 rounded-lg bg-yellow-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      Please configure your OpenAI API key in Settings to use the planning assistant.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500">Start a conversation to plan schedules</p>
                  <p className="mt-2 text-sm text-gray-400">
                    Try: "Create a schedule for next week" or "Add John to Monday morning shift"
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-lg rounded-lg px-4 py-2 ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : msg.role === "system"
                          ? "bg-red-100 text-red-900"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <div className="animate-pulse">Thinking...</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-96 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">Current Schedule</h2>
        {currentSchedule ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              Week of {currentSchedule.weekStart.toLocaleDateString()}
            </div>
            {currentSchedule.shifts
              .filter(shift => shift.assignedEmployees.length > 0)
              .slice(0, 8)
              .map((shift) => (
                <div key={shift.id} className="border-b border-gray-100 pb-2">
                  <div className="text-sm font-medium capitalize">
                    {shift.day} {shift.startTime}-{shift.endTime}
                  </div>
                  <div className="text-xs text-gray-500">
                    {shift.assignedEmployees.map(empId => {
                      const employee = employees.find(e => e.id === empId);
                      return employee ? employee.name : empId;
                    }).join(', ')}
                  </div>
                </div>
              ))}
            {currentSchedule.shifts.filter(shift => shift.assignedEmployees.length > 0).length > 8 && (
              <div className="text-xs text-gray-500">
                +{currentSchedule.shifts.filter(shift => shift.assignedEmployees.length > 0).length - 8} more shifts
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No active schedule</p>
            <p className="mt-2 text-sm">Generate a schedule to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}