// Практична 3 (розклад занять)
// Посилання на файл:https://github.com/anastasiat55/pr3

type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";
type CourseTypeSchedule = "Lecture" | "Seminar" | "Lab" | "Practice";

type Professor = { id: number; name: string; department: string };
type Classroom = { number: string; capacity: number; hasProjector: boolean };
type CourseSchedule = { id: number; name: string; type: CourseTypeSchedule };
type Lesson = { id: number; courseId: number; professorId: number; classroomNumber: string; dayOfWeek: DayOfWeek; timeSlot: TimeSlot };

const professors: Professor[] = [];
const classrooms: Classroom[] = [];
const courses: CourseSchedule[] = [];
const schedule: Lesson[] = [];

function addProfessor(professor: Professor): void { professors.push(professor); }
function addLesson(lesson: Lesson): boolean { if (validateLesson(lesson)) return false; schedule.push(lesson); return true; }

function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
  const occupied = new Set<string>();
  for (const l of schedule) if (l.timeSlot === timeSlot && l.dayOfWeek === dayOfWeek) occupied.add(l.classroomNumber);
  return classrooms.map(c => c.number).filter(num => !occupied.has(num));
}

function getProfessorSchedule(professorId: number): Lesson[] { return schedule.filter(l => l.professorId === professorId); }

type ScheduleConflictType = "ProfessorConflict" | "ClassroomConflict";
type ScheduleConflict = { type: ScheduleConflictType; lessonDetails: Lesson };

function validateLesson(lesson: Lesson): ScheduleConflict | null {
  for (const l of schedule) {
    const sameTime = l.dayOfWeek === lesson.dayOfWeek && l.timeSlot === lesson.timeSlot;
    if (sameTime && l.professorId === lesson.professorId) return { type: "ProfessorConflict", lessonDetails: l };
    if (sameTime && l.classroomNumber === lesson.classroomNumber) return { type: "ClassroomConflict", lessonDetails: l };
  }
  return null;
}

function getClassroomUtilization(classroomNumber: string): number {
  const totalSlots = 25;
  const used = schedule.filter(l => l.classroomNumber === classroomNumber).length;
  return Math.round((used / totalSlots) * 100);
}

function getMostPopularCourseType(): CourseTypeSchedule {
  const counter: Record<CourseTypeSchedule, number> = { Lecture: 0, Seminar: 0, Lab: 0, Practice: 0 };
  for (const l of schedule) { const crs = courses.find(c => c.id === l.courseId); if (crs) counter[crs.type]++; }
  return Object.entries(counter).reduce((a, b) => a[1] > b[1] ? a : b)[0] as CourseTypeSchedule;
}

function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
  const idx = schedule.findIndex(l => l.id === lessonId);
  if (idx === -1) return false;
  const candidate = { ...schedule[idx], classroomNumber: newClassroomNumber };
  if (validateLesson(candidate)) return false;
  schedule[idx] = candidate;
  return true;
}

function cancelLesson(lessonId: number): void {
  const idx = schedule.findIndex(l => l.id === lessonId);
  if (idx !== -1) schedule.splice(idx, 1);
}

