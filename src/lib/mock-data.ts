
import type { Subject, TimetableEntry } from '@/lib/types';

export const initialSubjects: Subject[] = [
    { id: '1', name: 'Computer Networks', shortCode: 'CN', color: 'bg-red-500' },
    { id: '2', name: 'Web Computing', shortCode: 'WC', color: 'bg-blue-500' },
    { id: '3', name: 'Artificial Intelligence', shortCode: 'AI', color: 'bg-green-500' },
    { id: '4', name: 'AI in Data Science', shortCode: 'SAIDS', color: 'bg-yellow-500' },
    { id: '5', name: 'professional communication and ethics', shortCode: 'PCE', color: 'bg-purple-500' },
    { id: '6', name: 'Data Warehousing & Mining', shortCode: 'DWM', color: 'bg-pink-500' },
];

export const initialTimetable: TimetableEntry[] = [
  // Monday
  { id: 'tt1', subjectId: '4', day: 'Monday', startTime: '09:30', endTime: '10:30' },
  { id: 'tt2', subjectId: '5', day: 'Monday', startTime: '13:00', endTime: '14:00' },
  { id: 'tt3', subjectId: '1', day: 'Monday', startTime: '14:00', endTime: '15:00' },
  { id: 'tt4', subjectId: '6', day: 'Monday', startTime: '15:00', endTime: '16:00' },
  // Tuesday
  { id: 'tt5', subjectId: '6', day: 'Tuesday', startTime: '10:30', endTime: '11:30' },
  { id: 'tt6', subjectId: '1', day: 'Tuesday', startTime: '13:00', endTime: '14:00' },
  { id: 'tt7', subjectId: '4', day: 'Tuesday', startTime: '14:00', endTime: '15:00' },
  // Wednesday
  { id: 'tt8', subjectId: '3', day: 'Wednesday', startTime: '11:30', endTime: '12:30' },
  { id: 'tt9', subjectId: '1', day: 'Wednesday', startTime: '13:00', endTime: '14:00' },
  { id: 'tt10', subjectId: '2', day: 'Wednesday', startTime: '14:00', endTime: '15:00' },
  // Thursday
  { id: 'tt11', subjectId: '2', day: 'Thursday', startTime: '09:30', endTime: '10:30' },
  { id: 'tt12', subjectId: '6', day: 'Thursday', startTime: '10:30', endTime: '11:30' },
  { id: 'tt13', subjectId: '3', day: 'Thursday', startTime: '13:00', endTime: '14:00' },
  { id: 'tt14', subjectId: '4', day: 'Thursday', startTime: '14:00', endTime: '15:00' },
  // Friday
  { id: 'tt15', subjectId: '3', day: 'Friday', startTime: '09:30', endTime: '10:30' },
  { id: 'tt16', subjectId: '2', day: 'Friday', startTime: '10:30', endTime: '11:30' },
  { id: 'tt17', subjectId: '5', day: 'Friday', startTime: '11:30', endTime: '12:30' },
];
