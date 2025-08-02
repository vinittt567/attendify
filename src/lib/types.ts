export type Subject = {
  id: string;
  name: string;
  shortCode?: string;
  color: string;
};

export type AttendanceRecord = {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: string;
  status: 'Present' | 'Absent' | 'No Class';
};

export type AttendanceSummary = {
  summary: string;
  percentage: number;
};

export type TimetableEntry = {
  id: string;
  subjectId: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
};
