
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
import { useAuth } from '@/context/auth-provider';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, writeBatch, addDoc, deleteDoc, query, where, setDoc } from 'firebase/firestore';
import { initialSubjects, initialTimetable } from '@/lib/mock-data';

const DAYS_OF_WEEK: TimetableEntry['day'][] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
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

  const fetchData = useCallback(async (uid: string) => {
    try {
      const subjectsCollection = collection(db, `users/${uid}/subjects`);
      const subjectsSnapshot = await getDocs(subjectsCollection);
      
      let fetchedSubjects: Subject[];

      if (subjectsSnapshot.empty) {
        // If no subjects, this is likely a new user. Seed the data.
        const batch = writeBatch(db);
        
        initialSubjects.forEach(subject => {
            const docRef = doc(db, `users/${uid}/subjects`, subject.id);
            batch.set(docRef, subject);
        });
        
        initialTimetable.forEach(entry => {
            const docRef = doc(db, `users/${uid}/timetable`, entry.id);
            batch.set(docRef, entry);
        });
        
        await batch.commit();
        
        // Refetch after seeding
        const newSubjectsSnapshot = await getDocs(subjectsCollection);
        fetchedSubjects = newSubjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
        
        const timetableSnapshot = await getDocs(collection(db, `users/${uid}/timetable`));
        setTimetable(timetableSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimetableEntry)));

      } else {
        fetchedSubjects = subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
        const timetableSnapshot = await getDocs(collection(db, `users/${uid}/timetable`));
        setTimetable(timetableSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimetableEntry)));
      }
      
      setSubjects(fetchedSubjects);
      
      const attendanceSnapshot = await getDocs(query(collection(db, `users/${uid}/attendance`)));
      setAttendance(attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord)));

    } catch (error) {
      console.error("Error fetching data:", error);
      if (error instanceof Error && 'code' in error && (error as any).code === 'failed-precondition') {
         toast({ title: "Enable Firestore", description: "Please create a Firestore database in your Firebase project console to continue.", variant: 'destructive', duration: 10000 });
      } else {
         toast({ title: "Error", description: "Could not fetch your data. Please try again later.", variant: 'destructive', duration: 10000 });
      }
    } finally {
      setIsDataLoaded(true);
    }
  }, [toast]);

  useEffect(() => {
    if (user && !isDataLoaded) {
      fetchData(user.uid);
    }
  }, [user, isDataLoaded, fetchData]);


  const handleAddSubject = async (values: SubjectFormValues) => {
    if (!user) return;
    try {
      const newSubjectRef = doc(collection(db, `users/${user.uid}/subjects`));
      const newSubject: Subject = {
        id: newSubjectRef.id,
        ...values,
      };
      await setDoc(newSubjectRef, values);
      setSubjects(prev => [...prev, newSubject]);
      setIsAddSubjectDialogOpen(false);
      toast({
        title: "Subject Added!",
        description: `${newSubject.name} has been added to your subjects.`,
      });
    } catch (error) {
      console.error("Error adding subject:", error);
      toast({ title: "Error", description: "Could not add subject.", variant: 'destructive' });
    }
  };
  
  const handleSaveAttendance = async (records: Omit<AttendanceRecord, 'id'>[]) => {
    if (!user || !records.length) return;
    try {
      const batch = writeBatch(db);
      const date = records[0].date;
      
      const q = query(collection(db, `users/${user.uid}/attendance`), where('date', '==', date));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(doc => {
          batch.delete(doc.ref);
      });

      records.forEach(record => {
        const docRef = doc(collection(db, `users/${user.uid}/attendance`));
        batch.set(docRef, record);
      });

      await batch.commit();
      
      await fetchData(user.uid);

      toast({
        title: "Attendance Saved",
        description: `Attendance for ${format(new Date(date), 'MMMM d, yyyy')} has been updated.`,
      });
    } catch (error) {
       console.error("Error saving attendance:", error);
       toast({ title: "Error", description: "Could not save attendance.", variant: 'destructive' });
    }
  };

  const openDeleteDialog = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      setSubjectToDelete(subject);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeleteSubject = async () => {
    if (!subjectToDelete || !user) return;
    
    try {
        const batch = writeBatch(db);

        const subjectRef = doc(db, `users/${user.uid}/subjects`, subjectToDelete.id);
        batch.delete(subjectRef);

        const ttQuery = query(collection(db, `users/${user.uid}/timetable`), where('subjectId', '==', subjectToDelete.id));
        const ttSnapshot = await getDocs(ttQuery);
        ttSnapshot.forEach(doc => batch.delete(doc.ref));

        const attQuery = query(collection(db, `users/${user.uid}/attendance`), where('subjectId', '==', subjectToDelete.id));
        const attSnapshot = await getDocs(attQuery);
        attSnapshot.forEach(doc => batch.delete(doc.ref));

        await batch.commit();

        setSubjects(prev => prev.filter(s => s.id !== subjectToDelete.id));
        setTimetable(prev => prev.filter(t => t.subjectId !== subjectToDelete.id));
        setAttendance(prev => prev.filter(a => a.subjectId !== subjectToDelete.id));
      
        toast({
            title: "Subject Deleted",
            description: `${subjectToDelete.name} and all its records have been removed.`,
            variant: 'destructive',
        });
    } catch (error) {
        console.error("Error deleting subject:", error);
        toast({ title: "Error", description: "Could not delete subject.", variant: 'destructive' });
    } finally {
        setSubjectToDelete(null);
        setIsDeleteDialogOpen(false);
    }
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
  
  if (authLoading || (!isDataLoaded && !user)) {
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
