'use client';

import { useState, useMemo } from 'react';
import type { Subject, AttendanceRecord } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subDays, startOfMonth, isWithinInterval } from 'date-fns';

type SubjectCardProps = {
  subject: Subject;
  attendance: AttendanceRecord[];
  onDelete: (subjectId: string) => void;
};

type FilterType = 'all' | '7days' | 'month';

export function SubjectCard({ subject, attendance, onDelete }: SubjectCardProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredAttendance = useMemo(() => {
    const now = new Date();
    if (filter === '7days') {
      const sevenDaysAgo = subDays(now, 7);
      return attendance.filter(a => new Date(a.date) >= sevenDaysAgo);
    }
    if (filter === 'month') {
      const startOfThisMonth = startOfMonth(now);
      return attendance.filter(a => new Date(a.date) >= startOfThisMonth);
    }
    return attendance;
  }, [attendance, filter]);

  const stats = useMemo(() => {
    const subjectAttendance = filteredAttendance.filter(a => a.subjectId === subject.id && a.status !== 'No Class');
    const daysPresent = subjectAttendance.filter((a) => a.status === 'Present').length;
    const totalDays = subjectAttendance.length;
    const percentage = totalDays > 0 ? (daysPresent / totalDays) * 100 : 0;
    return { daysPresent, totalDays, percentage };
  }, [filteredAttendance, subject.id]);

  return (
    <Card className={cn("flex flex-col border-l-4 transition-all hover:shadow-md", `border-${subject.color.replace('bg-', '')}`)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="font-headline text-xl">{subject.name}</CardTitle>
            {subject.shortCode && <Badge variant="outline" className="mt-1">{subject.shortCode}</Badge>}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onDelete(subject.id)}>
            <Trash2 className="h-4 w-4 text-muted-foreground transition-colors hover:text-destructive" />
            <span className="sr-only">Delete Subject</span>
          </Button>
        </div>
        <CardDescription>Attendance Overview</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex justify-around text-center mb-4">
          <div>
            <p className="text-2xl font-bold">{stats.totalDays}</p>
            <p className="text-xs text-muted-foreground">Total Days</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{stats.daysPresent}</p>
            <p className="text-xs text-muted-foreground">Present</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{stats.percentage.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Rate</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
        <div className="flex items-center justify-center gap-1 rounded-md bg-muted p-1">
          {(['all', 'month', '7days'] as FilterType[]).map(f => (
            <Button key={f} variant={filter === f ? 'default' : 'ghost'} size="sm" onClick={() => setFilter(f)} className="flex-1 capitalize text-xs h-7">
              {f === 'all' ? 'All Time' : f === 'month' ? 'Month' : '7 Days'}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
