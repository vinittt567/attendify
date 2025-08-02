'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Subject, AttendanceRecord } from '@/lib/types';
import type { SubjectFormValues } from '@/components/dashboard/add-subject-dialog';
import { Header } from '@/components/dashboard/header';
import { AddSubjectDialog } from '@/components/dashboard/add-subject-dialog';
import { SubjectCard } from '@/components/dashboard/subject-card';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceMarkerDialog } from '@/components/dashboard/attendance-marker-dialog';
import { format, isSameDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const MOCK_SUBJECTS: Subject[] = [
  { id: '1', name: 'Quantum Physics', shortCode: 'PHY404', color: 'bg-blue-500' },
  { id: '2', name: 'Organic Chemistry', shortCode: 'CHEM301', color: 'bg-purple-500' },
  { id: '3', name: 'Shakespearean Literature', shortCode: 'ENG210', color: 'bg-amber-500' },
  { id: '4', name: 'Advanced Calculus', shortCode: 'MATH350', color: 'bg-red-500' },
];

const MOCK_ATTENDANCE: AttendanceRecord[] = Array.from({ length: 30 }).flatMap((_, dayIndex) => 
  MOCK_SUBJECTS.map(subject => {
    const date = new Date();
    date.setDate(date.getDate() - dayIndex);
    return {
      date: format(date, 'yyyy-MM-dd'),
      subjectId: subject.id,
      status: Math.random() > 0.2 ? 'Present' : 'Absent',
    } as AttendanceRecord
  })
);

export default function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
  const [isMarkerDialogOpen, setIsMarkerDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    setSubjects(MOCK_SUBJECTS);
    setAttendance(MOCK_ATTENDANCE);
  }, []);

  const handleAddSubject = (values: SubjectFormValues) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      ...values,
    };
    setSubjects(prev => [...prev, newSubject]);
    setIsAddSubjectDialogOpen(false);
    toast({
      title: "Subject Added!",
      description: `${newSubject.name} has been added to your subjects.`,
    });
  };

  const handleSaveAttendance = (records: AttendanceRecord[]) => {
    setAttendance(prev => {
      const otherDaysAttendance = prev.filter(r => r.date !== records[0].date);
      return [...otherDaysAttendance, ...records];
    });
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${format(new Date(records[0].date), 'MMMM d, yyyy')} has been updated.`,
    });
  };
  
  const attendanceForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    return attendance.filter(r => isSameDay(new Date(r.date), selectedDate));
  }, [attendance, selectedDate]);
  
  const markedDays = useMemo(() => {
    const uniqueDates = new Set(attendance.map(a => a.date));
    return Array.from(uniqueDates).map(dateStr => new Date(dateStr));
  }, [attendance]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header onAddSubject={() => setIsAddSubjectDialogOpen(true)} />
      <main className="flex-1 p-4 sm:p-6 grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Subjects Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <AnimatePresence>
                {subjects.map((subject) => (
                  <motion.div
                    key={subject.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SubjectCard subject={subject} attendance={attendance} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Attendance Calendar</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsMarkerDialogOpen(true);
                }}
                modifiers={{ marked: markedDays }}
                modifiersStyles={{
                  marked: {
                    textDecoration: 'underline',
                    textDecorationColor: 'var(--primary)',
                    textUnderlineOffset: '0.2em',
                    textDecorationStyle: 'wavy',
                  }
                }}
                className="p-0"
              />
            </CardContent>
             <div className="p-4 pt-0 text-center">
                <Badge variant="secondary">Select a date to mark attendance</Badge>
            </div>
          </Card>
        </div>
      </main>
      
      <AddSubjectDialog
        isOpen={isAddSubjectDialogOpen}
        onOpenChange={setIsAddSubjectDialogOpen}
        onSubmit={handleAddSubject}
      />
      
      <AttendanceMarkerDialog
        isOpen={isMarkerDialogOpen}
        onOpenChange={setIsMarkerDialogOpen}
        date={selectedDate}
        subjects={subjects}
        attendanceForDay={attendanceForSelectedDay}
        onSave={handleSaveAttendance}
      />
    </div>
  );
}
