import React from 'react';
import { Course } from '../../types/course';
import { formatTimeDisplay, timeToMinutes } from '../../utils/mathEngine';

interface TimetableGridProps {
  courses: Course[];
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const TIME_SLOTS = [
  { label: '07:00', start: 7 * 60, end: 8 * 60 },
  { label: '08:00', start: 8 * 60, end: 9 * 60 },
  { label: '09:00', start: 9 * 60, end: 10 * 60 },
  { label: '10:00', start: 10 * 60, end: 11 * 60 },
  { label: '11:00', start: 11 * 60, end: 12 * 60 },
  { label: '12:00', start: 12 * 60, end: 13 * 60 },
  { label: '13:00', start: 13 * 60, end: 14 * 60 },
  { label: '14:00', start: 14 * 60, end: 15 * 60 },
  { label: '15:00', start: 15 * 60, end: 16 * 60 },
  { label: '16:00', start: 16 * 60, end: 17 * 60 },
  { label: '17:00', start: 17 * 60, end: 18 * 60 },
  { label: '18:00', start: 18 * 60, end: 19 * 60 },
  { label: '19:00', start: 19 * 60, end: 20 * 60 },
];

export const TimetableGrid: React.FC<TimetableGridProps> = ({ courses }) => {
  return (
    <div style={{ marginTop: '1rem' }}>
      <div className="timetable-grid">
        {/* Header Row */}
        <div className="timetable-header">Hora</div>
        {DAYS.map(day => (
          <div key={day} className="timetable-header">{day}</div>
        ))}

        {/* Time Slot Rows */}
        {TIME_SLOTS.map(slot => (
          <React.Fragment key={slot.label}>
            <div className="timetable-time-slot">{slot.label}</div>
            {DAYS.map(day => {
              // Find matching course for this day and time slot
              const matchingCourses = courses.filter(c => {
                if (c.day !== day) return false;
                const cStart = timeToMinutes(c.start_time);
                const cEnd = timeToMinutes(c.end_time);
                return cStart < slot.end && cEnd > slot.start;
              });

              return (
                <div key={day} className="timetable-cell">
                  {matchingCourses.map(c => {
                    const isPresencial = c.modality.toLowerCase() === 'presencial';
                    return (
                      <div
                        key={c.id || c.name}
                        className={`course-block ${isPresencial ? 'presencial' : 'virtual'}`}
                      >
                        <div style={{ fontWeight: 700, lineHeight: 1.2 }}>{c.name}</div>
                        <div style={{ fontSize: '0.68rem', opacity: 0.85, marginTop: '0.2rem' }}>
                          {formatTimeDisplay(c.start_time)} - {formatTimeDisplay(c.end_time)} | {c.credits} cr.
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
