import { Course } from './course';

export interface ScheduleEvaluation {
  valid: boolean;
  reasons: string[];
}

export interface GeneratedScheduleItem {
  courses: string[] | Course[]; // Names array or full course objects
  courseObjects?: Course[];
  totalCredits: number;
  valid: boolean;
  reasons: string[];
}

export interface ScheduleGenerationResponse {
  totalCourses: number;
  selectedAmount: number;
  totalCombinations: number;
  validSchedules: number;
  discardedSchedules: number;
  schedules: GeneratedScheduleItem[];
}
