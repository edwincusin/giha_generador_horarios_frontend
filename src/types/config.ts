export type RequiredModality = 'Cualquiera' | 'Presencial' | 'Virtual';

export interface ScheduleConfiguration {
  id?: number;
  numberOfCourses: number;
  maximumCredits: number;
  maximumDifficultCourses: number;
  requiredModality: RequiredModality;
  avoidTimeConflicts?: boolean;
  validatePrerequisites?: boolean;
  requiredCourses: string[]; // List of course names or IDs
  completedCourses: string[]; // List of completed course names or IDs
}

export interface ScheduleConfigurationFormData {
  numberOfCourses: number;
  maximumCredits: number;
  maximumDifficultCourses: number;
  requiredModality: RequiredModality;
  avoidTimeConflicts: boolean;
  validatePrerequisites: boolean;
  requiredCourses: string[];
  completedCourses: string[];
}
