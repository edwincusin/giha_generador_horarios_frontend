export interface Course {
  id: number;
  name: string;
  day: string; // "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
  start_time: string; // ISO DateTime string or HH:mm format "08:00"
  end_time: string; // ISO DateTime string or HH:mm format "10:00"
  modality: 'Presencial' | 'Virtual' | string;
  difficulty: 'Baja' | 'Media' | 'Alta' | string;
  credits: number;
  prerequisites?: PrerequisiteRelation[];
}

export interface CourseFormData {
  name: string;
  day: string;
  start_time: string;
  end_time: string;
  modality: string;
  difficulty: string;
  credits: number;
}

export interface PrerequisiteRelation {
  course_id: number;
  prerequisite_course_id: number;
}
