import { Employee, Schedule } from '@/lib/types';

export function exportEmployeesToCSV(employees: Employee[]) {
  const headers = ['Name', 'Age', 'Type', 'Weekly Hours'];
  const rows = employees.map(emp => [
    emp.name,
    emp.age.toString(),
    emp.type,
    emp.weeklyHours.toString()
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `employees-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportScheduleToJSON(schedule: Schedule) {
  const dataStr = JSON.stringify(schedule, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `schedule-${schedule.weekStart.toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importEmployeesFromCSV(
  file: File,
  onImport: (employees: Omit<Employee, 'id'>[]) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    const lines = text.split('\n');
    const employees: Omit<Employee, 'id'>[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const [name, age, type, weeklyHours] = line.split(',');
      if (name && age && type && weeklyHours) {
        employees.push({
          name: name.trim(),
          age: parseInt(age.trim()),
          type: type.trim() as 'leder' | 'ungarbejder',
          weeklyHours: parseInt(weeklyHours.trim())
        });
      }
    }

    onImport(employees);
  };
  reader.readAsText(file);
}