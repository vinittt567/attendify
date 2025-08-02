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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import type { Subject } from '@/lib/types';

const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name must be at least 2 characters.'),
  shortCode: z.string().max(5, 'Short code can be max 5 characters.').optional(),
  color: z.string().nonempty('Please select a color.'),
});

export type SubjectFormValues = Omit<Subject, 'id'>;

const colors = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

type AddSubjectDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: SubjectFormValues) => void;
};

export function AddSubjectDialog({ isOpen, onOpenChange, onSubmit }: AddSubjectDialogProps) {
  const form = useForm<z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      shortCode: '',
    },
  });

  const handleFormSubmit = (values: z.infer<typeof subjectSchema>) => {
    onSubmit({
        name: values.name,
        shortCode: values.shortCode,
        color: values.color
    });
    form.reset();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>Enter the details for your new subject.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Code (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. MATH" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Color Tag</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-6 gap-2"
                    >
                      {colors.map((color) => (
                        <FormItem key={color} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={color} className="sr-only" />
                          </FormControl>
                          <FormLabel className="cursor-pointer">
                            <div className={cn('h-10 w-10 rounded-full border-2', color, field.value === color ? 'ring-2 ring-offset-2 ring-primary' : 'border-transparent')}></div>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Subject</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
