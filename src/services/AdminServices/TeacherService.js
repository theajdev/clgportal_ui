import { private_axios_url } from "../base";

export const getAllTeachers = () => {
  return private_axios_url.get("/teacher/").then((response) => response.data);
};

export const addTeacher = (teacher) => {
  return private_axios_url
    .post("/teacher/", teacher)
    .then((response) => response.data);
};

export const deleteTeacher = (id) => {
  return private_axios_url
    .delete(`/teacher/${id}`)
    .then((response) => response.data);
};

export const modifyTeacher = (teacher, id) => {
  return private_axios_url
    .put(`/teacher/${id}`, teacher)
    .then((response) => response.data);
};

export const getTeachersByStatus = (status) => {
  console.log("Status:", status);
  return private_axios_url
    .get(`/teacher/status/${status}`)
    .then((response) => response.data);
};

export const getTeacherCount = () => {
  return private_axios_url
    .get(`/teacher/count`)
    .then((response) => response.data);
};
