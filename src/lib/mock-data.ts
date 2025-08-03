
import type { Subject, TimetableEntry } from '@/lib/types';

// This data is now a fallback and not actively used if Firebase is connected.
export const initialSubjects: Subject[] = [
    { id: 'sub1', name: 'Sample Subject 1', color: 'bg-purple-500' },
    { id: 'sub2', name: 'Sample Subject 2', color: 'bg-red-500' },
];

export const initialTimetable: TimetableEntry[] = [
  { id: 'tt1', subjectId: 'sub1', day: 'Monday', startTime: '09:30', endTime: '10:30' },
  { id: 'tt2', subjectId: 'sub2', day: 'Tuesday', startTime: '11:30', endTime: '12:30' },
];
