'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Subject, TimetableEntry } from '@/lib/types';

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const timetableSchema = z.object({
  subjectId: z.string().nonempty('Please select a subject.'),
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  startTime: z.string().regex(timeRegex, 'Invalid time format. Use HH:mm.').optional().or(z.literal('')),
  endTime: z.string().regex(timeRegex, 'Invalid time format. Use HH:mm.').optional().or(z.literal('')),
}).refine(data => {
    if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
    }
    return true;
}, {
  message: 'End time must be after start time.',
  path: ['endTime'],
});

export type TimetableFormValues = Omit<TimetableEntry, 'id'>;

const DAYS_OF_WEEK: TimetableEntry['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


type AddTimetableEntryDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: TimetableFormValues) => void;
  subjects: Subject[];
  defaultValues?: Partial<TimetableFormValues>;
};

export function AddTimetableEntryDialog({ isOpen, onOpenChange, onSubmit, subjects, defaultValues }: AddTimetableEntryDialogProps) {
  const form = useForm<z.infer<typeof timetableSchema>>({
    resolver: zodResolver(timetableSchema),
    defaultValues: {
      day: 'Monday',
      ...defaultValues
    },
  });

  const handleFormSubmit = (values: z.infer<typeof timetableSchema>) => {
    const dataToSubmit: TimetableFormValues = {
      ...values,
      startTime: values.startTime || '',
      endTime: values.endTime || '',
    };
    onSubmit(dataToSubmit);
    form.reset({subjectId: '', day: 'Monday', startTime: '', endTime: ''});
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Class to Timetable</DialogTitle>
          <DialogDescription>Select the subject, day, and time for the new class.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day of the Week</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       {DAYS_OF_WEEK.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Start Time (Optional)</FormLabel>
                    <FormControl>
                        <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>End Time (Optional)</FormLabel>
                    <FormControl>
                        <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Add to Timetable</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
