type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

type Professor = {
    id: number;
    name: string;
    department: string;
};

type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

type Course = {
    id: number;
    name: string;
    type: CourseType;
};

type Lesson = {
    id: number
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

let professors: Professor[] = [];
let courses: Course[] = [];
let schedule: Lesson[] = [];
let classrooms: Classroom[] = [
    { number: "101", capacity: 30, hasProjector: true },
    { number: "102", capacity: 25, hasProjector: false },
    { number: "103", capacity: 40, hasProjector: true },
    { number: "201", capacity: 35, hasProjector: true },
    { number: "202", capacity: 30, hasProjector: false },
    { number: "203", capacity: 20, hasProjector: true },
    { number: "301", capacity: 50, hasProjector: true },
    { number: "302", capacity: 60, hasProjector: false },
    { number: "303", capacity: 45, hasProjector: true },
    { number: "401", capacity: 55, hasProjector: false }
];

function addProfessor(professor: Professor): void {
    const existingProfessor = professors.find(p => p.id === professor.id);

    if (existingProfessor) {
        console.error(`Professor with ID ${professor.id} already exists: ${existingProfessor.name}, ${existingProfessor.department}`);
        return;
    }

    professors.push(professor);
    console.log(`Professor ${professor.name} added successfully.`);
}

function addCourse(course: Course): boolean {
    if (!courses.some(existingCourse => existingCourse.id === course.id)) {
        courses.push(course);
        return true;
    }
    console.error(`Курс с ID ${course.id} уже существует.`);
    return false;
}

function addLesson(lesson: Lesson): boolean {
    const classroomExists = classrooms.some(classroom => classroom.number === lesson.classroomNumber);

    if (!classroomExists) {
        alert(`Cannot add lesson: Classroom ${lesson.classroomNumber} does not exist.`);
        return false;
    }

    const courseExists = courses.some(course => course.id === lesson.courseId);

    if (!courseExists) {
        alert(`Cannot add lesson: Course with ID ${lesson.courseId} does not exist.`);
        return false;
    }

    const conflict = validateLesson(lesson);

    if (!conflict) {
        schedule.push(lesson);
        return true;
    }

    console.error(`Cannot add lesson: ${conflict.type} for lesson on ${conflict.lessonDetails.dayOfWeek} at ${conflict.lessonDetails.timeSlot}`);
    alert("Some info is incorrect");
    return false;
}


function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    const occupiedClassrooms = schedule
        .filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
        .map(lesson => lesson.classroomNumber);

    return classrooms
        .filter(classroom => !occupiedClassrooms.includes(classroom.number))
        .map(classroom => classroom.number);
}

function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter(lesson => lesson.professorId === professorId);
}

function validateLesson(lesson: Lesson): ScheduleConflict | null {
    const professorExists = professors.some(professor => professor.id === lesson.professorId);
    if (!professorExists) {
        return {
            type: "ProfessorConflict",
            lessonDetails: lesson
        };
    }

    const classroomConflict = schedule.find(
        existingLesson => existingLesson.classroomNumber === lesson.classroomNumber &&
            existingLesson.timeSlot === lesson.timeSlot &&
            existingLesson.dayOfWeek === lesson.dayOfWeek
    );

    if (classroomConflict) {
        return { type: "ClassroomConflict", lessonDetails: classroomConflict };
    }

    const professorConflict = schedule.find(
        existingLesson => existingLesson.professorId === lesson.professorId &&
            existingLesson.timeSlot === lesson.timeSlot &&
            existingLesson.dayOfWeek === lesson.dayOfWeek
    );

    if (professorConflict) {
        return { type: "ProfessorConflict", lessonDetails: professorConflict };
    }

    return null;
}


function getClassroomUtilization(classroomNumber: string): number {
    let timeSlots = 5;
    const totalSlots = 5 * timeSlots;

    const occupiedSlots = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;

    return (occupiedSlots / totalSlots) * 100;
}

function getMostPopularCourseType(): CourseType {
    const typeCounts: { [key in CourseType]?: number } = {};

    schedule.forEach(lesson => {
        const course = courses.find(c => c.id === lesson.courseId);
        if (course) {
            typeCounts[course.type] = (typeCounts[course.type] || 0) + 1;
        }
    });

    return Object.keys(typeCounts).reduce((a, b) =>
        (typeCounts[a as CourseType]! > typeCounts[b as CourseType]!) ? a : b) as CourseType;
}

function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lesson = schedule.find(l => l.id === lessonId);
    if (!lesson) {
        console.error("Lesson not found");
        return false;
    }

    lesson.classroomNumber = newClassroomNumber;
    return true;
}

function cancelLesson(lessonId: number): void {
    const lessonIndex = schedule.findIndex(l => l.courseId === lessonId);
    if (lessonIndex !== -1) {
        schedule.splice(lessonIndex, 1);
        console.log(`Lesson with id ${lessonId} has been canceled.`);
    } else {
        console.error("Lesson not found");
    }
}
