"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { EmployeeType } from "@/lib/types";

interface QuickAddEmployeeProps {
  onAdd: (employee: { name: string; age: number; type: EmployeeType; weeklyHours: number }) => void;
}

export function QuickAddEmployee({ onAdd }: QuickAddEmployeeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    type: "ungarbejder" as EmployeeType,
    weeklyHours: "20"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age) return;

    onAdd({
      name: formData.name,
      age: parseInt(formData.age),
      type: formData.type,
      weeklyHours: parseInt(formData.weeklyHours)
    });

    setFormData({ name: "", age: "", type: "ungarbejder", weeklyHours: "20" });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <Plus className="mr-2 h-4 w-4" />
        Quick Add
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Quick Add Employee</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
            min="14"
            max="70"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as EmployeeType })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="ungarbejder">Ungarbejder</option>
            <option value="leder">Leder</option>
          </select>
          
          <input
            type="number"
            placeholder="Weekly Hours"
            value={formData.weeklyHours}
            onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
            min="1"
            max="40"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}