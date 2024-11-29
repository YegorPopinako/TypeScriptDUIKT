"use strict";
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic_Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
var CourseType;
(function (CourseType) {
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
})(Semester || (Semester = {}));
var Grade;
(function (Grade) {
    Grade[Grade["Excellent"] = 5] = "Excellent";
    Grade[Grade["Good"] = 4] = "Good";
    Grade[Grade["Satisfactory"] = 3] = "Satisfactory";
    Grade[Grade["Unsatisfactory"] = 2] = "Unsatisfactory";
})(Grade || (Grade = {}));
var Faculty;
(function (Faculty) {
    Faculty["Computer_Science"] = "Computer_Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
class UniversityManagementSystem {
    constructor() {
        this.students = [];
        this.courses = [];
        this.grades = [];
        this.courseRegistrations = new Map(); // courseId -> Set of studentIds
    }
    // Enroll a student
    enrollStudent(student) {
        const newStudent = Object.assign({ id: this.students.length + 1 }, student);
        this.students.push(newStudent);
        return newStudent;
    }
    // Register a student for a course
    registerForCourse(studentId, courseId) {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        if (!student || !course) {
            throw new Error('Student or course not found.');
        }
        if (student.faculty !== course.faculty) {
            throw new Error('Student cannot register for courses outside their faculty.');
        }
        if (student.status !== StudentStatus.Active) {
            throw new Error('Only active students can register for courses.');
        }
        const registeredStudents = this.courseRegistrations.get(courseId) || new Set();
        if (registeredStudents.size >= course.maxStudents) {
            throw new Error('Course is already full.');
        }
        registeredStudents.add(studentId);
        this.courseRegistrations.set(courseId, registeredStudents);
    }
    // Set a grade for a student
    setGrade(studentId, courseId, grade) {
        var _a;
        const courseStudents = this.courseRegistrations.get(courseId);
        if (!courseStudents || !courseStudents.has(studentId)) {
            throw new Error('Student is not registered for this course.');
        }
        this.grades.push({
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: ((_a = this.getCourseById(courseId)) === null || _a === void 0 ? void 0 : _a.semester) || Semester.First,
        });
    }
    // Update a student's status
    updateStudentStatus(studentId, newStatus) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) {
            throw new Error('Student not found.');
        }
        if (student.status === StudentStatus.Graduated && newStatus !== StudentStatus.Graduated) {
            throw new Error('Cannot change status of a graduated student.');
        }
        if (student.status === StudentStatus.Expelled) {
            throw new Error('Cannot update status of an expelled student.');
        }
        student.status = newStatus;
    }
    // Get all students by faculty
    getStudentsByFaculty(faculty) {
        return this.students.filter(s => s.faculty === faculty);
    }
    // Get grades of a specific student
    getStudentGrades(studentId) {
        return this.grades.filter(g => g.studentId === studentId);
    }
    // Get available courses for a specific faculty and semester
    getAvailableCourses(faculty, semester) {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }
    // Calculate average grade of a student
    calculateAverageGrade(studentId) {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0)
            return 0;
        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return total / studentGrades.length;
    }
    // Get top students (excellent grades) by faculty
    getTopStudentsByFaculty(faculty) {
        const topStudentIds = new Set(this.grades
            .filter(g => g.grade === Grade.Excellent)
            .map(g => g.studentId));
        return this.students.filter(s => s.faculty === faculty && topStudentIds.has(s.id));
    }
    // Add a new course
    addCourse(course) {
        const newCourse = Object.assign({ id: this.courses.length + 1 }, course);
        this.courses.push(newCourse);
        return newCourse;
    }
    // Get course by ID
    getCourseById(courseId) {
        return this.courses.find(c => c.id === courseId);
    }
}
const ums = new UniversityManagementSystem();
// Додаємо студентів
const activeStudent = ums.enrollStudent({
    fullName: 'Alice Johnson',
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: 'CS-101',
});
const expelledStudent = ums.enrollStudent({
    fullName: 'Bob Smith',
    faculty: Faculty.Computer_Science,
    year: 2,
    status: StudentStatus.Expelled,
    enrollmentDate: new Date(),
    groupNumber: 'CS-201',
});
// Додаємо курси
const course = ums.addCourse({
    name: 'Data Structures',
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 1,
});
// Приклад позитивних і негативних тест кейсів
console.log(`Students in ${Faculty.Computer_Science} faculty:`, ums.getStudentsByFaculty(Faculty.Computer_Science).map(student => student.fullName));
console.log(`Students in ${Faculty.Law} faculty:`, ums.getStudentsByFaculty(Faculty.Law).map(student => student.fullName));
console.log('Grades for Alice Johnson:', ums.getStudentGrades(activeStudent.id).map(g => g.grade));
console.log('Available courses for CS faculty, Semester 1:', ums.getAvailableCourses(Faculty.Computer_Science, Semester.First).map(c => c.name));
try {
    // Позитивний кейс: реєстрація активного студента
    ums.registerForCourse(activeStudent.id, course.id);
    console.log('Successfully registered Alice Johnson for the course.');
}
catch (e) {
    if (e instanceof Error) {
        console.error('Error registering Alice Johnson:', e.message);
    }
    else {
        console.error('Unknown error occurred:', e);
    }
}
try {
    // Негативний кейс: реєстрація відрахованого студента
    ums.registerForCourse(expelledStudent.id, course.id);
}
catch (e) {
    if (e instanceof Error) {
        console.error('Error registering Bob Smith:', e.message);
    }
    else {
        console.error('Unknown error occurred:', e);
    }
}
try {
    // Негативний кейс: реєстрація при переповненому курсі
    ums.registerForCourse(activeStudent.id, course.id); // Спроба повторної реєстрації
}
catch (e) {
    if (e instanceof Error) {
        console.error('Error registering second student:', e.message);
    }
    else {
        console.error('Unknown error occurred:', e);
    }
}
try {
    // Позитивний кейс: виставлення оцінки
    ums.setGrade(activeStudent.id, course.id, Grade.Excellent);
    console.log('Grade successfully set for Alice Johnson.');
}
catch (e) {
    if (e instanceof Error) {
        console.error('Error setting grade:', e.message);
    }
    else {
        console.error('Unknown error occurred:', e);
    }
}
try {
    // Негативний кейс: Виставлення оцінки студенту, який не зареєстрований
    ums.setGrade(expelledStudent.id, course.id, Grade.Good);
}
catch (e) {
    if (e instanceof Error) {
        console.error('Error setting grade for Bob Smith:', e.message);
    }
    else {
        console.error('Unknown error occurred:', e);
    }
}
try {
    // Позитивний кейс: Зміна статусу студента
    ums.updateStudentStatus(activeStudent.id, StudentStatus.Graduated);
    console.log("Alice Johnson's status updated to Graduated.");
}
catch (e) {
    if (e instanceof Error) {
        console.error('Error updating status:', e.message);
    }
    else {
        console.error('Unknown error occurred:', e);
    }
}
try {
    // Негативний кейс: Зміна статусу відрахованого студента
    ums.updateStudentStatus(expelledStudent.id, StudentStatus.Active);
}
catch (e) {
    if (e instanceof Error) {
        console.error('Error updating Bob Smith\'s status:', e.message);
    }
    else {
        console.error('Unknown error occurred:', e);
    }
}
// Додаткові перевірки
console.log('Grades:', ums.getStudentGrades(activeStudent.id));
console.log('Available courses:', ums.getAvailableCourses(Faculty.Computer_Science, Semester.First).map(c => c.name));
console.log('Average grade for Alice Johnson:', ums.calculateAverageGrade(activeStudent.id).toFixed(2));
console.log('Average grade for Bob Smith:', ums.calculateAverageGrade(expelledStudent.id).toFixed(2));
console.log('Top students in Computer Science:', ums.getTopStudentsByFaculty(Faculty.Computer_Science).map(s => s.fullName));
