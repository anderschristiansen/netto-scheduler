import { Employee } from '@/lib/types';

export const sampleEmployees: Omit<Employee, 'id'>[] = [
  {
    name: 'Anna Nielsen',
    age: 25,
    type: 'leder',
    weeklyHours: 37
  },
  {
    name: 'Lars Andersen',
    age: 32,
    type: 'leder',
    weeklyHours: 37
  },
  {
    name: 'Mette Larsen',
    age: 28,
    type: 'leder',
    weeklyHours: 30
  },
  {
    name: 'Emma Johansen',
    age: 17,
    type: 'ungarbejder',
    weeklyHours: 15
  },
  {
    name: 'Mikkel Hansen',
    age: 16,
    type: 'ungarbejder',
    weeklyHours: 12
  },
  {
    name: 'Sofia Petersen',
    age: 17,
    type: 'ungarbejder',
    weeklyHours: 18
  },
  {
    name: 'Oliver Rasmussen',
    age: 16,
    type: 'ungarbejder',
    weeklyHours: 10
  },
  {
    name: 'Ida Sørensen',
    age: 17,
    type: 'ungarbejder',
    weeklyHours: 16
  }
];

export function loadSampleEmployees(addEmployeeFn: (employee: Omit<Employee, 'id'>) => void) {
  sampleEmployees.forEach(emp => addEmployeeFn(emp));
}