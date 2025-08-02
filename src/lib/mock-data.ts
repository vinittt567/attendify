
import type { Subject, TimetableEntry } from '@/lib/types';

export const initialSubjects: Subject[] = [
    { id: 'sub1', name: 'SAIDS/SC', color: 'bg-purple-500' },
    { id: 'sub2', name: 'PCE-II/GG', color: 'bg-red-500' },
    { id: 'sub3', name: 'DWM/SK', color: 'bg-cyan-500' },
    { id: 'sub4', name: 'CN/YG', color: 'bg-orange-500' },
    { id: 'sub5', name: 'AI/VB', color: 'bg-lime-500' },
    { id: 'sub6', name: 'WC/SB', color: 'bg-amber-500' },
    { id: 'sub7', name: 'MINI PROJECT', color: 'bg-yellow-500' },
    { id: 'sub8', name: 'DSSA/CODE CREW/HACKATHON', color: 'bg-teal-500' },
    { id: 'sub9', name: 'CODE CREW/MENTOR MEET', color: 'bg-rose-500' },
    { id: 'sub10', name: 'Honours', color: 'bg-slate-500' },
];

export const initialTimetable: TimetableEntry[] = [
  // Monday
  { id: 'tt1', subjectId: 'sub1', day: 'Monday', startTime: '09:30', endTime: '10:30' },
  { id: 'tt2', subjectId: 'sub5', day: 'Monday', startTime: '10:30', endTime: '11:30' },
  { id: 'tt3', subjectId: 'sub2', day: 'Monday', startTime: '10:30', endTime: '11:30' },
  { id: 'tt4', subjectId: 'sub3', day: 'Monday', startTime: '10:30', endTime: '11:30' },
  { id: 'tt5', subjectId: 'sub2', day: 'Monday', startTime: '13:00', endTime: '14:00' },
  { id: 'tt6', subjectId: 'sub4', day: 'Monday', startTime: '14:00', endTime: '15:00' },
  { id: 'tt7', subjectId: 'sub3', day: 'Monday', startTime: '15:00', endTime: '16:00' },

  // Tuesday
  { id: 'tt8', subjectId: 'sub4', day: 'Tuesday', startTime: '09:30', endTime: '10:30' },
  { id: 'tt9', subjectId: 'sub3', day: 'Tuesday', startTime: '09:30', endTime: '10:30' },
  { id: 'tt10', subjectId: 'sub2', day: 'Tuesday', startTime: '09:30', endTime: '10:30' },
  { id: 'tt11', subjectId: 'sub3', day: 'Tuesday', startTime: '11:30', endTime: '12:30' },
  { id: 'tt12', subjectId: 'sub4', day: 'Tuesday', startTime: '13:00', endTime: '14:00' },
  { id: 'tt13', subjectId: 'sub1', day: 'Tuesday', startTime: '14:00', endTime: '15:00' },
  { id: 'tt14', subjectId: 'sub7', day: 'Tuesday', startTime: '15:00', endTime: '16:00' },
  
  // Wednesday
  { id: 'tt15', subjectId: 'sub3', day: 'Wednesday', startTime: '09:30', endTime: '10:30' },
  { id: 'tt16', subjectId: 'sub6', day: 'Wednesday', startTime: '09:30', endTime: '10:30' },
  { id: 'tt17', subjectId: 'sub5', day: 'Wednesday', startTime: '09:30', endTime: '10:30' },
  { id: 'tt18', subjectId: 'sub5', day: 'Wednesday', startTime: '11:30', endTime: '12:30' },
  { id: 'tt19', subjectId: 'sub4', day: 'Wednesday', startTime: '13:00', endTime: '14:00' },
  { id: 'tt20', subjectId: 'sub6', day: 'Wednesday', startTime: '14:00', endTime: '15:00' },
  { id: 'tt21', subjectId: 'sub8', day: 'Wednesday', startTime: '15:00', endTime: '16:00' },
  
  // Thursday
  { id: 'tt22', subjectId: 'sub6', day: 'Thursday', startTime: '09:30', endTime: '10:30' },
  { id: 'tt23', subjectId: 'sub3', day: 'Thursday', startTime: '10:30', endTime: '11:30' },
  { id: 'tt24', subjectId: 'sub9', day: 'Thursday', startTime: '11:30', endTime: '12:30' },
  { id: 'tt25', subjectId: 'sub5', day: 'Thursday', startTime: '13:00', endTime: '14:00' },
  { id: 'tt26', subjectId: 'sub1', day: 'Thursday', startTime: '14:00', endTime: '15:00' },
  { id: 'tt27', subjectId: 'sub10', day: 'Thursday', startTime: '15:00', endTime: '16:00' },

  // Friday
  { id: 'tt28', subjectId: 'sub5', day: 'Friday', startTime: '09:30', endTime: '10:30' },
  { id: 'tt29', subjectId: 'sub6', day: 'Friday', startTime: '10:30', endTime: '11:30' },
  { id: 'tt30', subjectId: 'sub2', day: 'Friday', startTime: '11:30', endTime: '12:30' },
  { id: 'tt31', subjectId: 'sub2', day: 'Friday', startTime: '13:00', endTime: '14:00' },
  { id: 'tt32', subjectId: 'sub5', day: 'Friday', startTime: '13:00', endTime: '14:00' },
  { id: 'tt33', subjectId: 'sub6', day: 'Friday', startTime: '13:00', endTime: '14:00' },
  { id: 'tt34', subjectId: 'sub10', day: 'Friday', startTime: '15:00', endTime: '16:00' },
];
