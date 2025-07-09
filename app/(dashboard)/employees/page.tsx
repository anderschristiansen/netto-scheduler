"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Download } from "lucide-react";
import { Employee, EmployeeType } from "@/lib/types";
import { useEmployeeStore } from "@/lib/store";
import { QuickAddEmployee } from "@/components/employees/quick-add";
import { loadSampleEmployees } from "@/lib/utils/sample-data";
import { exportEmployeesToCSV } from "@/lib/utils/export-import";
import { PageTransition, FadeIn, SlideIn } from "@/components/layout/page-transition";

export default function EmployeesPage() {
  const { employees, addEmployee, deleteEmployee } = useEmployeeStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const lederCount = employees.filter(emp => emp.type === 'leder').length;
  const ungarbejderCount = employees.filter(emp => emp.type === 'ungarbejder').length;
  const totalHours = employees.reduce((sum, emp) => sum + emp.weeklyHours, 0);

  return (
    <PageTransition>
      <div className="mb-8 flex items-center justify-between">
        <FadeIn>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
            <p className="mt-2 text-gray-600">
              Manage your store employees and their schedules
            </p>
          </div>
        </FadeIn>
        <SlideIn direction="right">
          <div className="flex space-x-2">
            <QuickAddEmployee onAdd={addEmployee} />
            {employees.length === 0 && (
              <button
                onClick={() => loadSampleEmployees(addEmployee)}
                className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Load Sample Data
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </button>
            {employees.length > 0 && (
              <button
                onClick={() => exportEmployeesToCSV(employees)}
                className="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </button>
            )}
          </div>
        </SlideIn>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SlideIn delay={0.1}>
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">{lederCount}</div>
              <div className="ml-2 text-sm text-gray-600">Ledere</div>
            </div>
          </div>
        </SlideIn>
        <SlideIn delay={0.2}>
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-green-600">{ungarbejderCount}</div>
              <div className="ml-2 text-sm text-gray-600">Ungarbejdere</div>
            </div>
          </div>
        </SlideIn>
        <SlideIn delay={0.3}>
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-purple-600">{totalHours}</div>
              <div className="ml-2 text-sm text-gray-600">Total Hours/Week</div>
            </div>
          </div>
        </SlideIn>
      </div>

      <FadeIn delay={0.4}>
        <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Name
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Age
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Weekly Hours
              </th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="text-gray-500">
                    <p className="text-sm">No employees added yet</p>
                    <p className="mt-1 text-sm">
                      Click "Add Employee" to get started
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {employee.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {employee.age}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        employee.type === "leder"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {employee.type === "leder" ? "Leder" : "Ungarbejder"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {employee.weeklyHours}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => deleteEmployee(employee.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </FadeIn>

      {showAddModal && (
        <AddEmployeeModal 
          onClose={() => setShowAddModal(false)} 
          onAdd={addEmployee}
        />
      )}
    </PageTransition>
  );
}

function AddEmployeeModal({ 
  onClose, 
  onAdd 
}: { 
  onClose: () => void; 
  onAdd: (employee: Omit<Employee, 'id'>) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    type: 'ungarbejder' as EmployeeType,
    weeklyHours: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.weeklyHours) return;

    onAdd({
      name: formData.name,
      age: parseInt(formData.age),
      type: formData.type,
      weeklyHours: parseInt(formData.weeklyHours)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                Add New Employee
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                    min="14"
                    max="70"
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as EmployeeType })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="ungarbejder">Ungarbejder (Under 18)</option>
                    <option value="leder">Leder (18+)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                    Weekly Hours
                  </label>
                  <input
                    type="number"
                    id="hours"
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                    min="1"
                    max="40"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
              >
                Add Employee
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}