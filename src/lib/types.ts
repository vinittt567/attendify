export type Subject = {
  id: string;
  name: string;
  shortCode?: string;
  color: string;
};

export type AttendanceRecord = {
  date: string; // YYYY-MM-DD
  subjectId: string;
  status: 'Present' | 'Absent' | 'No Class';
};

export type AttendanceSummary = {
  summary: string;
  percentage: number;
};
