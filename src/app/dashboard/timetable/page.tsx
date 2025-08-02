'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { TimetableEntry, Subject } from '@/lib/types';
import { AddTimetableEntryDialog, TimetableFormValues } from '@/components/dashboard/add-timetable-entry-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Header } from '@/components/dashboard/header'; 
import { AddSubjectDialog, SubjectFormValues } from '@/components/dashboard/add-subject-dialog';

const DAYS_OF_WEEK: TimetableEntry['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const initialSubjects: Subject[] = [
    { id: '1', name: 'Computer Networks', shortCode: 'CN', color: 'bg-red-500' },
    { id: '2', name: 'Wireless Communication', shortCode: 'WC', color: 'bg-blue-500' },
    { id: '3', name: 'Artificial Intelligence', shortCode: 'AI', color: 'bg-green-500' },
    { id: '4', name: 'AI in Data Science', shortCode: 'SAIDS', color: 'bg-yellow-500' },
    { id: '5', name: 'Prof. & Career Enhancement', shortCode: 'PCE', color: 'bg-purple-500' },
    { id: '6', name: 'Data Warehousing & Mining', shortCode: 'DWM', color: 'bg-pink-500' },
];

const initialTimetable: TimetableEntry[] = [
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


export default function TimetablePage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [timetable, setTimetable] = useState<TimetableEntry[]>(initialTimetable);
  const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = useState(false);
  const [isAddSubjectDialogOpen, setIsAddSubjectDialogOpen] = useState(false);
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

  const handleAddEntry = (values: TimetableFormValues) => {
    const newEntry: TimetableEntry = {
      id: crypto.randomUUID(),
      ...values,
    };
    setTimetable(prev => [...prev, newEntry]);
    setIsAddEntryDialogOpen(false);
    toast({
      title: "Timetable Updated",
      description: `Added class for ${values.day}.`,
    });
  };

  const handleDeleteEntry = (entryId: string) => {
    setTimetable(prev => prev.filter(entry => entry.id !== entryId));
     toast({
      title: "Class Removed",
      description: `The class has been removed from your timetable.`,
      variant: 'destructive'
    });
  }

  const getSubjectById = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId);
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
        />
      
        <AddSubjectDialog
            isOpen={isAddSubjectDialogOpen}
            onOpenChange={setIsAddSubjectDialogOpen}
            onSubmit={handleAddSubject}
        />
    </div>
  );
}
