import { Course, CourseFormData } from '../types/course';
import { ScheduleConfiguration } from '../types/config';
import { ScheduleGenerationResponse } from '../types/schedule';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.mensaje || errorData.error) {
        errorMessage = errorData.mensaje || errorData.error;
      }
    } catch {
      // Ignore JSON parse error
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

// ---------------- COURSES API ----------------
export async function getCoursesApi(): Promise<Course[]> {
  const res = await fetch(`${API_BASE_URL}/courses`);
  if (res.status === 404) {
    return []; // No courses found
  }
  return handleResponse<Course[]>(res);
}

export async function createCourseApi(data: CourseFormData): Promise<{ mensaje: string }> {
  const res = await fetch(`${API_BASE_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<{ mensaje: string }>(res);
}

export async function updateCourseApi(id: number, data: CourseFormData): Promise<{ mensaje: string }> {
  const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<{ mensaje: string }>(res);
}

export async function deleteCourseApi(id: number): Promise<{ mensaje: string }> {
  const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<{ mensaje: string }>(res);
}

// ---------------- PREREQUISITES API ----------------
export async function getPrerequisitesApi(): Promise<{ course_id: number; prerequisite_course_id: number }[]> {
  const res = await fetch(`${API_BASE_URL}/prerequisites`);
  if (res.status === 404) return [];
  return handleResponse(res);
}

export async function createPrerequisiteApi(course_id: number, prerequisite_course_id: number): Promise<{ mensaje: string }> {
  const res = await fetch(`${API_BASE_URL}/prerequisites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ course_id, prerequisite_course_id }),
  });
  return handleResponse<{ mensaje: string }>(res);
}

export async function deletePrerequisiteApi(course_id: number, prerequisite_course_id: number): Promise<{ mensaje: string }> {
  const res = await fetch(`${API_BASE_URL}/prerequisites/${course_id}/${prerequisite_course_id}`, {
    method: 'DELETE',
  });
  return handleResponse<{ mensaje: string }>(res);
}

// ---------------- SCHEDULE GENERATION API ----------------
export async function generateSchedulesApi(config: ScheduleConfiguration): Promise<ScheduleGenerationResponse> {
  const res = await fetch(`${API_BASE_URL}/schedules/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  return handleResponse<ScheduleGenerationResponse>(res);
}
