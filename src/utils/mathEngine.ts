import { Course } from '../types/course';
import { ScheduleConfiguration } from '../types/config';
import { GeneratedScheduleItem } from '../types/schedule';

// Factorial calculation
export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Combination count C(n, r)
export function combinationCount(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return Math.round(factorial(n) / (factorial(r) * factorial(n - r)));
}

// Permutation count P(n, r)
export function permutationCount(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return Math.round(factorial(n) / factorial(n - r));
}

// Combinations Generator Algorithm
export function generateCombinations<T>(elements: T[], size: number): T[][] {
  const results: T[][] = [];

  function combine(startIndex: number, current: T[]) {
    if (current.length === size) {
      results.push([...current]);
      return;
    }

    for (let i = startIndex; i < elements.length; i++) {
      current.push(elements[i]);
      combine(i + 1, current);
      current.pop();
    }
  }

  combine(0, []);
  return results;
}

// Set Theory Helpers
export function setUnion<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA, ...setB]);
}

export function setIntersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter(item => setB.has(item)));
}

export function setDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter(item => !setB.has(item)));
}

export function isSubset<T>(subset: Set<T>, mainSet: Set<T>): boolean {
  return [...subset].every(item => mainSet.has(item));
}

// Parse Time String "HH:mm" or ISO DateTime to minutes from midnight
export function timeToMinutes(timeStr: string | Date): number {
  if (typeof timeStr === 'object' && timeStr instanceof Date) {
    return timeStr.getUTCHours() * 60 + timeStr.getUTCMinutes();
  }
  if (!timeStr) return 0;
  // If ISO string like "1970-01-01T08:00:00.000Z"
  if (timeStr.includes('T')) {
    const timePart = timeStr.split('T')[1].substring(0, 5);
    const [h, m] = timePart.split(':').map(Number);
    return h * 60 + m;
  }
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

// Format time string for display (HH:mm)
export function formatTimeDisplay(timeStr: string | Date): string {
  if (typeof timeStr === 'object' && timeStr instanceof Date) {
    const h = timeStr.getUTCHours().toString().padStart(2, '0');
    const m = timeStr.getUTCMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }
  if (!timeStr) return '00:00';
  if (timeStr.includes('T')) {
    return timeStr.split('T')[1].substring(0, 5);
  }
  return timeStr.substring(0, 5);
}

// Check time conflict between two courses
export function haveTimeConflict(courseA: Course, courseB: Course): boolean {
  if (courseA.day !== courseB.day) return false;
  const startA = timeToMinutes(courseA.start_time);
  const endA = timeToMinutes(courseA.end_time);
  const startB = timeToMinutes(courseB.start_time);
  const endB = timeToMinutes(courseB.end_time);

  return startA < endB && startB < endA;
}

// Check schedule conflicts
export function hasScheduleConflicts(courses: Course[]): boolean {
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      if (haveTimeConflict(courses[i], courses[j])) {
        return true;
      }
    }
  }
  return false;
}

// Evaluate schedule proposition rules and get detailed result
export function evaluateScheduleDetailed(
  schedule: Course[],
  config: ScheduleConfiguration,
  allPrerequisites: { course_id: number; prerequisite_course_id: number }[] = []
): { valid: boolean; reasons: string[]; propositionBreakdown: Record<string, boolean> } {
  const reasons: string[] = [];

  // Proposition T: Correct size
  const T = schedule.length === config.numberOfCourses;
  if (!T) {
    reasons.push(`La cantidad de materias (${schedule.length}) no coincide con la solicitada (${config.numberOfCourses}).`);
  }

  // Proposition O: Required courses inclusion (O ⊆ H)
  const scheduleNamesSet = new Set(schedule.map(c => c.name));
  const scheduleIdsSet = new Set(schedule.map(c => c.id));

  let O = true;
  if (config.requiredCourses && config.requiredCourses.length > 0) {
    const missing = config.requiredCourses.filter(req => {
      const isId = !isNaN(Number(req));
      return isId ? !scheduleIdsSet.has(Number(req)) : !scheduleNamesSet.has(req);
    });
    if (missing.length > 0) {
      O = false;
      reasons.push(`No contiene todas las materias obligatorias (Falta: ${missing.join(', ')}).`);
    }
  }

  // Proposition C: Avoid time conflicts (¬P)
  const avoidConflicts = config.avoidTimeConflicts ?? true;
  const hasConflicts = hasScheduleConflicts(schedule);
  const C = avoidConflicts ? !hasConflicts : true;
  if (avoidConflicts && hasConflicts) {
    reasons.push('El horario presenta cruce de horas entre materias del mismo día.');
  }

  // Proposition M: Required modality
  let M = true;
  if (config.requiredModality === 'Presencial') {
    M = schedule.some(c => c.modality.toLowerCase() === 'presencial');
    if (!M) reasons.push('El horario no contiene al menos una materia de modalidad Presencial.');
  } else if (config.requiredModality === 'Virtual') {
    M = schedule.some(c => c.modality.toLowerCase() === 'virtual');
    if (!M) reasons.push('El horario no contiene al menos una materia de modalidad Virtual.');
  }

  // Proposition D: Maximum difficult courses
  const difficultCount = schedule.filter(c => c.difficulty.toLowerCase() === 'alta').length;
  const D = difficultCount <= config.maximumDifficultCourses;
  if (!D) {
    reasons.push(`Supera el máximo de materias difíciles permitido (${difficultCount} > ${config.maximumDifficultCourses}).`);
  }

  // Proposition R: Maximum credits
  const totalCredits = schedule.reduce((sum, c) => sum + c.credits, 0);
  const R = totalCredits <= config.maximumCredits;
  if (!R) {
    reasons.push(`Supera el máximo de créditos permitido (${totalCredits} > ${config.maximumCredits}).`);
  }

  // Proposition U: Validate prerequisites (P → Q)
  let U = true;
  if (config.validatePrerequisites ?? true) {
    const completedSet = new Set(config.completedCourses.map(c => (isNaN(Number(c)) ? c : Number(c))));
    const availableCourseIds = new Set([...schedule.map(c => c.id), ...[...completedSet].filter(x => typeof x === 'number') as number[]]);

    for (const course of schedule) {
      // Find prerequisites for this course
      const reqs = allPrerequisites.filter(p => p.course_id === course.id);
      for (const req of reqs) {
        if (!availableCourseIds.has(req.prerequisite_course_id)) {
          U = false;
          reasons.push(`No cumple prerrequisito para "${course.name}" (Requiere materia ID ${req.prerequisite_course_id}).`);
        }
      }
    }
  }

  const valid = T && O && C && M && D && R && U;

  return {
    valid,
    reasons,
    propositionBreakdown: {
      T_CorrectSize: T,
      O_RequiredCourses: O,
      C_NoConflicts: C,
      M_Modality: M,
      D_Difficulty: D,
      R_Credits: R,
      U_Prerequisites: U,
    },
  };
}

// Client-side local full schedule generator helper
export function generateLocalSchedules(
  allCourses: Course[],
  config: ScheduleConfiguration,
  allPrerequisites: { course_id: number; prerequisite_course_id: number }[] = []
): {
  totalCourses: number;
  selectedAmount: number;
  totalCombinations: number;
  validSchedules: number;
  discardedSchedules: number;
  schedules: GeneratedScheduleItem[];
} {
  const combinations = generateCombinations(allCourses, config.numberOfCourses);
  const totalCombinations = combinationCount(allCourses.length, config.numberOfCourses);

  const evaluated: GeneratedScheduleItem[] = combinations.map(combo => {
    const evaluation = evaluateScheduleDetailed(combo, config, allPrerequisites);
    const totalCredits = combo.reduce((sum, c) => sum + c.credits, 0);
    return {
      courses: combo.map(c => c.name),
      courseObjects: combo,
      totalCredits,
      valid: evaluation.valid,
      reasons: evaluation.reasons,
    };
  });

  const validList = evaluated.filter(s => s.valid);
  const discardedList = evaluated.filter(s => !s.valid);

  return {
    totalCourses: allCourses.length,
    selectedAmount: config.numberOfCourses,
    totalCombinations,
    validSchedules: validList.length,
    discardedSchedules: discardedList.length,
    schedules: evaluated,
  };
}
