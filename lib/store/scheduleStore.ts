import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Schedule, ScheduledShift, Employee } from '@/lib/types';
import { validateSchedule } from '@/lib/utils/validation';
import { v4 as uuidv4 } from 'uuid';

interface ScheduleStore {
  currentSchedule: Schedule | null;
  scheduleHistory: Schedule[];
  
  setCurrentSchedule: (schedule: Schedule) => void;
  updateShift: (shiftId: string, updates: Partial<ScheduledShift>) => void;
  assignEmployee: (shiftId: string, employeeId: string) => void;
  removeEmployee: (shiftId: string, employeeId: string) => void;
  
  saveToHistory: () => void;
  loadFromHistory: (scheduleId: string) => void;
  
  validateCurrentSchedule: (employees: Employee[]) => ReturnType<typeof validateSchedule>;
  
  createNewVersion: () => void;
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      currentSchedule: null,
      scheduleHistory: [],
      
      setCurrentSchedule: (schedule) => {
        set({ currentSchedule: schedule });
      },
      
      updateShift: (shiftId, updates) => {
        set((state) => {
          if (!state.currentSchedule) return state;
          
          return {
            currentSchedule: {
              ...state.currentSchedule,
              shifts: state.currentSchedule.shifts.map((shift) =>
                shift.id === shiftId ? { ...shift, ...updates } : shift
              ),
              updatedAt: new Date(),
            },
          };
        });
      },
      
      assignEmployee: (shiftId, employeeId) => {
        set((state) => {
          if (!state.currentSchedule) return state;
          
          return {
            currentSchedule: {
              ...state.currentSchedule,
              shifts: state.currentSchedule.shifts.map((shift) =>
                shift.id === shiftId
                  ? {
                      ...shift,
                      assignedEmployees: [...shift.assignedEmployees, employeeId],
                    }
                  : shift
              ),
              updatedAt: new Date(),
            },
          };
        });
      },
      
      removeEmployee: (shiftId, employeeId) => {
        set((state) => {
          if (!state.currentSchedule) return state;
          
          return {
            currentSchedule: {
              ...state.currentSchedule,
              shifts: state.currentSchedule.shifts.map((shift) =>
                shift.id === shiftId
                  ? {
                      ...shift,
                      assignedEmployees: shift.assignedEmployees.filter(
                        (id) => id !== employeeId
                      ),
                    }
                  : shift
              ),
              updatedAt: new Date(),
            },
          };
        });
      },
      
      saveToHistory: () => {
        const current = get().currentSchedule;
        if (!current) return;
        
        set((state) => ({
          scheduleHistory: [...state.scheduleHistory, current],
        }));
      },
      
      loadFromHistory: (scheduleId) => {
        const schedule = get().scheduleHistory.find((s) => s.id === scheduleId);
        if (schedule) {
          set({ currentSchedule: { ...schedule, id: uuidv4(), version: 1 } });
        }
      },
      
      validateCurrentSchedule: (employees) => {
        const schedule = get().currentSchedule;
        if (!schedule) return [];
        
        return validateSchedule(schedule, employees);
      },
      
      createNewVersion: () => {
        set((state) => {
          if (!state.currentSchedule) return state;
          
          const newSchedule: Schedule = {
            ...state.currentSchedule,
            id: uuidv4(),
            version: state.currentSchedule.version + 1,
            updatedAt: new Date(),
          };
          
          return {
            currentSchedule: newSchedule,
            scheduleHistory: [...state.scheduleHistory, state.currentSchedule],
          };
        });
      },
    }),
    {
      name: 'schedule-store',
    }
  )
);