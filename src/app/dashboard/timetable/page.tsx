
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { TimetableEntry, Subject } from '@/lib/types';
import { AddTimetableEntryDialog, TimetableFormValues } from '@/components/dashboard/add-timetable-entry-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Header } from '@/components/dashboard/header'; 
import { AddSubjectDialog, SubjectFormValues } from '@/components/dashboard/add-subject-dialog';
import { useAuth } from '@/context/auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const DAYS_OF_WEEK: TimetableEntry['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimetablePage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = useState(false);
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const subjectsQuery = query(collection(db, `users/${user.uid}/subjects`));
      const timetableQuery = query(collection(db, `users/${user.uid}/timetable`));
      
      const [subjectsSnapshot, timetableSnapshot] = await Promise.all([
        getDocs(subjectsQuery),
        getDocs(timetableQuery),
      ]);
      
      setSubjects(subjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject)));
      setTimetable(timetableSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimetableEntry)));

    } catch (error) {
      console.error("Error fetching data:", error);
      toast({ title: "Error", description: "Could not fetch your data.", variant: 'destructive' });
    } finally {
      setIsDataLoaded(true);
    }
  }, [user, toast]);

  useEffect(() => {
    if(user && !isDataLoaded) {
      fetchData();
    }
  }, [user, isDataLoaded, fetchData]);

  const handleAddSubject = async (values: SubjectFormValues) => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/subjects`), values);
      const newSubject: Subject = { id: docRef.id, ...values };
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

  const handleAddEntry = async (values: TimetableFormValues) => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/timetable`), values);
      const newEntry: TimetableEntry = {
        id: docRef.id,
        ...values,
      };
      setTimetable(prev => [...prev, newEntry].sort((a,b) => a.startTime.localeCompare(b.startTime)));
      setIsAddEntryDialogOpen(false);
      toast({
        title: "Timetable Updated",
        description: `Added class for ${values.day}.`,
      });
    } catch (error) {
      console.error("Error adding timetable entry:", error);
      toast({ title: "Error", description: "Could not add timetable entry.", variant: 'destructive' });
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/timetable`, entryId));
      setTimetable(prev => prev.filter(entry => entry.id !== entryId));
       toast({
        title: "Class Removed",
        description: `The class has been removed from your timetable.`,
        variant: 'destructive'
      });
    } catch (error) {
      console.error("Error deleting timetable entry:", error);
      toast({ title: "Error", description: "Could not delete timetable entry.", variant: 'destructive' });
    }
  }

  const getSubjectById = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId);
  }
  
  if (!isDataLoaded) {
    return <div>Loading your timetable...</div>
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Header onAddSubject={() => setIsAddSubjectDialogOpen(true)} />
        <main className="flex-1 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-headline text-2xl font-bold">Weekly Timetable</h1>
                <Button onClick={() => {
                  if (subjects.length > 0) {
                    setIsAddEntryDialogOpen(true)
                  } else {
                    toast({
                      title: "Add a Subject First",
                      description: "You need to add a subject before creating timetable entries.",
                    })
                  }
                }}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Class
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
                {DAYS_OF_WEEK.map(day => (
                    <Card key={day} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg">{day}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 flex-grow">
                            {timetable
                                .filter(entry => entry.day === day)
                                .sort((a,b) => a.startTime.localeCompare(b.startTime))
                                .map(entry => {
                                    const subject = getSubjectById(entry.subjectId);
                                    return (
                                        <div key={entry.id} className="rounded-lg border p-3 text-sm relative group">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={cn("h-2 w-2 rounded-full", subject?.color ?? 'bg-gray-400')}></div>
                                                <p className="font-semibold">{subject?.name ?? 'Unknown Subject'}</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground ml-4">{entry.startTime} - {entry.endTime}</p>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleDeleteEntry(entry.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    )
                                })
                            }
                             {timetable.filter(entry => entry.day === day).length === 0 && (
                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                    No classes scheduled.
                                </div>
                             )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
        
        <AddTimetableEntryDialog 
            isOpen={isAddEntryDialogOpen}
            onOpenChange={setIsAddEntryDialogOpen}
            onSubmit={handleAddEntry}
            subjects={subjects}
            defaultValues={{
              startTime: '',
              endTime: ''
            }}
        />
      
        <AddSubjectDialog
            isOpen={isAddSubjectDialogOpen}
            onOpenChange={setIsAddSubjectDialogOpen}
            onSubmit={handleAddSubject}
        />
    </div>
  );
}

    