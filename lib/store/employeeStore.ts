import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Employee } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface EmployeeStore {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployee: (id: string) => Employee | undefined;
  getEmployeesByType: (type: 'leder' | 'ungarbejder') => Employee[];
}

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: [],
      
      addEmployee: (employeeData) => {
        const newEmployee: Employee = {
          ...employeeData,
          id: uuidv4(),
        };
        set((state) => ({
          employees: [...state.employees, newEmployee],
        }));
      },
      
      updateEmployee: (id, updatedData) => {
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...updatedData } : emp
          ),
        }));
      },
      
      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        }));
      },
      
      getEmployee: (id) => {
        return get().employees.find((emp) => emp.id === id);
      },
      
      getEmployeesByType: (type) => {
        return get().employees.filter((emp) => emp.type === type);
      },
    }),
    {
      name: 'employee-store',
    }
  )
);