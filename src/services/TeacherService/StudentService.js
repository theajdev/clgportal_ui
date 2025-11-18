import { private_axios_url } from "../base";

export const getAllStudents = () => {
  return private_axios_url.get("/student/").then((response) => response.data);
};

export const addNewStudent = (student) => {
  return private_axios_url
    .post("/student/", student, { withCredentials: true })
    .then((response) => response.data);
};

export const modifyStudent = (student, id) => {
  return private_axios_url
    .put(`/student/${id}`, student, { withCredentials: true })
    .then((response) => response.data);
};

export const deleteStudent = (id) => {
  return private_axios_url
    .delete(`/student/${id}`)
    .then((response) => response.data);
};

export const getStudentsByStatus = (status) => {
  return private_axios_url
    .get(`/student/status/${status}`)
    .then((response) => response.data);
};
