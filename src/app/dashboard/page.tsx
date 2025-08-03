
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Subject, AttendanceRecord, TimetableEntry } from '@/lib/types';
import type { SubjectFormValues } from '@/components/dashboard/add-subject-dialog';
import { Header } from '@/components/dashboard/header';
import { AddSubjectDialog } from '@/components/dashboard/add-subject-dialog';
import { SubjectCard } from '@/components/dashboard/subject-card';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AttendanceMarkerDialog } from '@/components/dashboard/attendance-marker-dialog';
import { format, getDay } from 'date-fns';
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
import { initialSubjects, initialTimetable } from '@/lib/mock-data';

const DAYS_OF_WEEK: TimetableEntry['day'][] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
  const [isMarkerDialogOpen, setIsMarkerDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    // Load mock data since Firebase is removed
    setSubjects(initialSubjects);
    setTimetable(initialTimetable);
    setIsDataLoaded(true);
  }, []);

  const handleAddSubject = async (values: SubjectFormValues) => {
    const newSubject: Subject = {
      id: `sub${subjects.length + 1}`,
      ...values
    };
    setSubjects(prev => [...prev, newSubject]);
    setIsAddSubjectDialogOpen(false);
    toast({
      title: "Subject Added!",
      description: `${newSubject.name} has been added to your subjects.`,
    });
  };
  
  const handleSaveAttendance = async (records: Omit<AttendanceRecord, 'id'>[]) => {
    if (!records.length) return;
    const date = records[0].date;
    
    // Filter out old records for the same date and add new ones
    setAttendance(prev => [
      ...prev.filter(r => r.date !== date),
      ...records.map((r, i) => ({...r, id: `att-${date}-${i}`}))
    ]);

    toast({
      title: "Attendance Saved",
      description: `Attendance for ${format(new Date(date), 'MMMM d, yyyy')} has been updated.`,
    });
  };

  const openDeleteDialog = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      setSubjectToDelete(subject);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeleteSubject = async () => {
    if (!subjectToDelete) return;
    
    setSubjects(prev => prev.filter(s => s.id !== subjectToDelete.id));
    setTimetable(prev => prev.filter(t => t.subjectId !== subjectToDelete.id));
    setAttendance(prev => prev.filter(a => a.subjectId !== subjectToDelete.id));
  
    toast({
        title: "Subject Deleted",
        description: `${subjectToDelete.name} and all its records have been removed.`,
        variant: 'destructive',
    });

    setSubjectToDelete(null);
    setIsDeleteDialogOpen(false);
  };
  
  const attendanceForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return attendance.filter(r => r.date === dateStr);
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
    return Array.from(uniqueDates).map(dateStr => new Date(dateStr + 'T00:00:00'));
  }, [attendance]);
  
  const overallStats = useMemo(() => {
    const totalLectures = attendance.filter(a => a.status === 'Present' || a.status === 'Absent').length;
    const attendedLectures = attendance.filter(a => a.status === 'Present').length;
    const percentage = totalLectures > 0 ? (attendedLectures / totalLectures) * 100 : 0;
    return { totalLectures, attendedLectures, percentage };
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
  
  if (!isDataLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading your personalized dashboard...</div>
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
        <div className="lg:col-span-1 space-y-6">
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
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">Overall Statistics</CardTitle>
                <CardDescription>Your attendance at a glance.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-around text-center">
                    <div>
                        <p className="text-3xl font-bold">{overallStats.totalLectures}</p>
                        <p className="text-sm text-muted-foreground">Total Lectures</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-green-600">{overallStats.attendedLectures}</p>
                        <p className="text-sm text-muted-foreground">Attended</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-primary">{overallStats.percentage.toFixed(0)}%</p>
                        <p className="text-sm text-muted-foreground">Percentage</p>
                    </div>
                </div>
            </CardContent>
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
