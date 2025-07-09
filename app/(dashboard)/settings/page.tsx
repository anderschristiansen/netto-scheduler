"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [storeHours, setStoreHours] = useState({
    open: "07:00",
    close: "22:00",
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure store hours and shift rules
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Store Hours
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="open-time" className="block text-sm font-medium text-gray-700">
                  Opening Time
                </label>
                <input
                  type="time"
                  id="open-time"
                  value={storeHours.open}
                  onChange={(e) => setStoreHours({ ...storeHours, open: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="close-time" className="block text-sm font-medium text-gray-700">
                  Closing Time
                </label>
                <input
                  type="time"
                  id="close-time"
                  value={storeHours.close}
                  onChange={(e) => setStoreHours({ ...storeHours, close: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Shift Rules
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Weekday Shifts (Monday-Friday)</h4>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li>• Morning: 07:00-16:00 (3 employees)</li>
                  <li>• Evening: 16:00-22:00 (3 employees)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Weekend Shifts (Saturday-Sunday)</h4>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li>• Early: 07:00-14:00 (2 leder, 1 ungarbejder)</li>
                  <li>• Mid: 10:00-17:00 (1 ungarbejder)</li>
                  <li>• Late: 14:00-22:00 (3 employees)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Staff Requirements
            </h3>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>• Minimum 1 leder and 1 ungarbejder per shift</p>
              <p>• Minimum 11 hours rest between shifts</p>
              <p>• Weekly hour limits must be respected</p>
              <p>• No double-booking allowed</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              AI Configuration
            </h3>
            <div className="mt-4">
              <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
                OpenAI API Key
              </label>
              <input
                type="password"
                id="api-key"
                placeholder="sk-..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-2 text-sm text-gray-500">
                Your API key is stored locally and never sent to our servers
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}