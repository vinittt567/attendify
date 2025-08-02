
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Subject, AttendanceRecord, TimetableEntry } from '@/lib/types';
import { initialSubjects, initialTimetable } from '@/lib/mock-data';
import type { SubjectFormValues } from '@/components/dashboard/add-subject-dialog';
import { Header } from '@/components/dashboard/header';
import { AddSubjectDialog } from '@/components/dashboard/add-subject-dialog';
import { SubjectCard } from '@/components/dashboard/subject-card';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceMarkerDialog } from '@/components/dashboard/attendance-marker-dialog';
import { format, isSameDay, getDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DAYS_OF_WEEK: TimetableEntry['day'][] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(initialTimetable);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
  const [isMarkerDialogOpen, setIsMarkerDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

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

  const openDeleteDialog = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      setSubjectToDelete(subject);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeleteSubject = () => {
    if (subjectToDelete) {
      setSubjects(prev => prev.filter(s => s.id !== subjectToDelete.id));
      setAttendance(prev => prev.filter(a => a.subjectId !== subjectToDelete.id));
      toast({
        title: "Subject Deleted",
        description: `${subjectToDelete.name} and its attendance records have been removed.`,
        variant: 'destructive',
      });
    }
    setSubjectToDelete(null);
    setIsDeleteDialogOpen(false);
  };
  
  const attendanceForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    return attendance.filter(r => isSameDay(new Date(r.date), selectedDate));
  }, [attendance, selectedDate]);
  
  const subjectsForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    const dayOfWeek = DAYS_OF_WEEK[getDay(selectedDate)];
    const subjectIdsForDay = new Set(timetable
      .filter(entry => entry.day === dayOfWeek)
      .map(entry => entry.subjectId));
    return subjects.filter(subject => subjectIdsForDay.has(subject.id));
  }, [selectedDate, timetable, subjects]);

  const markedDays = useMemo(() => {
    const uniqueDates = new Set(attendance.map(a => a.date));
    return Array.from(uniqueDates).map(dateStr => new Date(dateStr));
  }, [attendance]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (!date) return;

    if (subjects.length === 0) {
      toast({
        title: "Add a Subject First",
        description: "You need to add at least one subject before marking attendance.",
      });
      return;
    }

    const dayOfWeek = DAYS_OF_WEEK[getDay(date)];
    const subjectIdsForDay = new Set(timetable
      .filter(entry => entry.day === dayOfWeek)
      .map(entry => entry.subjectId));
    
    if (subjectIdsForDay.size === 0) {
      toast({
        title: "No Classes Scheduled",
        description: `There are no classes scheduled for ${dayOfWeek}.`,
      });
      return;
    }

    setIsMarkerDialogOpen(true);
  }

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
                    <SubjectCard 
                      subject={subject} 
                      attendance={attendance}
                      onDelete={openDeleteDialog}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {subjects.length === 0 && (
                <div className="text-center text-muted-foreground col-span-full py-12">
                  <h3 className="text-lg font-semibold">No subjects yet!</h3>
                  <p className="mt-1">Click the "Add Subject" button to get started.</p>
                </div>
              )}
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
                onSelect={handleDateSelect}
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
        subjects={subjectsForSelectedDay}
        attendanceForDay={attendanceForSelectedDay}
        onSave={handleSaveAttendance}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the subject "{subjectToDelete?.name}" and all its associated attendance records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSubject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
