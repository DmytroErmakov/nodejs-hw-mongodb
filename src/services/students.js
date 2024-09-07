import StudentCollection from "../db/models/Student.js";

export const getAllStudents = () => StudentCollection.find();

export const getStudentById = id => StudentCollection.findById(id);
