'use server';

import { generateAttendanceSummary } from '@/ai/flows/attendance-summary';
import type { AttendanceSummaryInput, AttendanceSummaryOutput } from '@/ai/flows/attendance-summary';

export async function getAttendanceSummaryAction(
  input: AttendanceSummaryInput
): Promise<AttendanceSummaryOutput> {
  try {
    const result = await generateAttendanceSummary(input);
    return result;
  } catch (error) {
    console.error('Error generating attendance summary:', error);
    return {
      summary: 'Could not generate summary at this time. Please try again later.',
      percentage: (input.daysPresent / input.totalDays) * 100,
    };
  }
}
