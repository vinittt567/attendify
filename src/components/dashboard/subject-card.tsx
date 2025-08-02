'use client';

import { useState, useMemo } from 'react';
import type { Subject, AttendanceRecord, AttendanceSummary } from '@/lib/types';
import { getAttendanceSummaryAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, BrainCircuit, RotateCw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { subDays, startOfMonth, isWithinInterval } from 'date-fns';

type SubjectCardProps = {
  subject: Subject;
  attendance: AttendanceRecord[];
  onDelete: (subjectId: string) => void;
};

type FilterType = 'all' | '7days' | 'month';

export function SubjectCard({ subject, attendance, onDelete }: SubjectCardProps) {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredAttendance = useMemo(() => {
    const now = new Date();
    if (filter === '7days') {
      const sevenDaysAgo = subDays(now, 7);
      return attendance.filter(a => isWithinInterval(new Date(a.date), { start: sevenDaysAgo, end: now }));
    }
    if (filter === 'month') {
      const startOfThisMonth = startOfMonth(now);
      return attendance.filter(a => isWithinInterval(new Date(a.date), { start: startOfThisMonth, end: now }));
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

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      const result = await getAttendanceSummaryAction({
        subject: subject.name,
        daysPresent: stats.daysPresent,
        totalDays: stats.totalDays,
      });
      setSummary(result);
    } catch (e) {
      setError('Failed to generate summary.');
    } finally {
      setIsLoading(false);
    }
  };

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

        <div className="space-y-2">
            {summary && !isLoading && (
              <div className="rounded-lg border bg-background/50 p-3 text-sm">
                <p className="flex items-start gap-2">
                  <BrainCircuit className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                  <span>{summary.summary}</span>
                </p>
              </div>
            )}
            {isLoading && (
              <div className="flex items-center justify-center rounded-lg border bg-background/50 p-3 text-sm text-muted-foreground">
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Generating summary...
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2 sm:flex-row sm:justify-between">
        <div className="flex items-center justify-center gap-1 rounded-md bg-muted p-1">
          {(['all', 'month', '7days'] as FilterType[]).map(f => (
            <Button key={f} variant={filter === f ? 'default' : 'ghost'} size="sm" onClick={() => setFilter(f)} className="flex-1 capitalize text-xs h-7">
              {f === 'all' ? 'All Time' : f === 'month' ? 'Month' : '7 Days'}
            </Button>
          ))}
        </div>
        <Button onClick={handleGenerateSummary} disabled={isLoading || stats.totalDays === 0} variant="outline" size="sm" className="h-9">
          <Wand2 className="mr-2 h-4 w-4" />
          {summary ? 'Regenerate Summary' : 'AI Summary'}
        </Button>
      </CardFooter>
    </Card>
  );
}
