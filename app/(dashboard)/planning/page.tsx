"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function PlanningPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages([...messages, { role: "user", content: message }]);
    setMessage("");
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
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
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
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-96 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">Current Schedule</h2>
        <div className="text-center text-gray-500">
          <p>No active schedule</p>
          <p className="mt-2 text-sm">Generate a schedule to see it here</p>
        </div>
      </div>
    </div>
  );
}