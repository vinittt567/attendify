'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Subject, AttendanceRecord } from '@/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type AttendanceMarkerDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  date: Date | undefined;
  subjects: Subject[];
  attendanceForDay: Omit<AttendanceRecord, 'id'>[];
  onSave: (records: Omit<AttendanceRecord, 'id'>[]) => void;
};

type LocalAttendance = {
  [subjectId: string]: 'Present' | 'Absent' | 'No Class';
};

export function AttendanceMarkerDialog({
  isOpen,
  onOpenChange,
  date,
  subjects,
  attendanceForDay,
  onSave,
}: AttendanceMarkerDialogProps) {
  const [localAttendance, setLocalAttendance] = useState<LocalAttendance>({});

  useEffect(() => {
    if (isOpen) {
      const initialAttendance = subjects.reduce((acc, subject) => {
        const existingRecord = attendanceForDay.find(a => a.subjectId === subject.id);
        acc[subject.id] = existingRecord ? existingRecord.status : 'Present';
        return acc;
      }, {} as LocalAttendance);
      setLocalAttendance(initialAttendance);
    }
  }, [isOpen, subjects, attendanceForDay]);

  const handleSave = () => {
    if (!date) return;
    const recordsToSave: Omit<AttendanceRecord, 'id'>[] = Object.entries(localAttendance).map(([subjectId, status]) => ({
      date: format(date, 'yyyy-MM-dd'),
      subjectId,
      status,
    }));
    onSave(recordsToSave);
    onOpenChange(false);
  };
  
  if (!date) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            For date: <span className="font-semibold text-foreground">{format(date, 'MMMM d, yyyy')}</span>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-4">
            {subjects.map((subject, index) => (
              <div key={subject.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-3 w-3 rounded-full", subject.color)}></div>
                    <Label htmlFor={`status-${subject.id}`} className="font-semibold">{subject.name}</Label>
                  </div>
                  <RadioGroup
                    id={`status-${subject.id}`}
                    value={localAttendance[subject.id]}
                    onValueChange={(value: 'Present' | 'Absent' | 'No Class') =>
                      setLocalAttendance(prev => ({ ...prev, [subject.id]: value }))
                    }
                    className="flex gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Present" id={`present-${subject.id}`} />
                      <Label htmlFor={`present-${subject.id}`}>Present</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Absent" id={`absent-${subject.id}`} />
                      <Label htmlFor={`absent-${subject.id}`}>Absent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No Class" id={`noclass-${subject.id}`} />
                      <Label htmlFor={`noclass-${subject.id}`}>No Class</Label>
                    </div>
                  </RadioGroup>
                </div>
                {index < subjects.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
             {subjects.length === 0 && (
                <p className="text-center text-muted-foreground">No classes scheduled for this day.</p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={handleSave} disabled={subjects.length === 0}>Save Attendance</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
