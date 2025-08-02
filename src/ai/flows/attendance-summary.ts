'use server';

/**
 * @fileOverview Generates an attendance summary for a given subject.
 *
 * - generateAttendanceSummary - A function that generates the attendance summary.
 * - AttendanceSummaryInput - The input type for the generateAttendanceSummary function.
 * - AttendanceSummaryOutput - The return type for the generateAttendanceSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AttendanceSummaryInputSchema = z.object({
  subject: z.string().describe('The subject for which to generate the summary.'),
  totalDays: z.number().describe('The total number of days for the subject.'),
  daysPresent: z.number().describe('The number of days the student was present.'),
});
export type AttendanceSummaryInput = z.infer<typeof AttendanceSummaryInputSchema>;

const AttendanceSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the attendance for the subject.'),
  percentage: z.number().describe('The attendance percentage for the subject.'),
});
export type AttendanceSummaryOutput = z.infer<typeof AttendanceSummaryOutputSchema>;

export async function generateAttendanceSummary(input: AttendanceSummaryInput): Promise<AttendanceSummaryOutput> {
  return attendanceSummaryFlow(input);
}

const attendanceSummaryPrompt = ai.definePrompt({
  name: 'attendanceSummaryPrompt',
  input: {schema: AttendanceSummaryInputSchema},
  output: {schema: AttendanceSummaryOutputSchema},
  prompt: `You are an assistant that provides attendance summaries for students.

  Given the following information, generate a concise and informative summary of the student's attendance for the subject.

  Subject: {{{subject}}}
  Total Days: {{{totalDays}}}
  Days Present: {{{daysPresent}}}

  Also calculate the attendance percentage.

  Summary:`,
});

const attendanceSummaryFlow = ai.defineFlow(
  {
    name: 'attendanceSummaryFlow',
    inputSchema: AttendanceSummaryInputSchema,
    outputSchema: AttendanceSummaryOutputSchema,
  },
  async input => {
    const percentage = (input.daysPresent / input.totalDays) * 100;
    const {output} = await attendanceSummaryPrompt({...input, percentage});
    return {
      ...output!,
      percentage,
    };
  }
);
