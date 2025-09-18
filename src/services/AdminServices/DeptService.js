import { private_axios_url } from "../base";

export const getAllCourses = () => {
  return private_axios_url
    .get("/department/")
    .then((response) => response.data);
};

export const addCourse = (course) => {
  console.log(course);
  return private_axios_url
    .post("/department/", course)
    .then((response) => response.data);
};

export const deleteCourse = (id) => {
  return private_axios_url
    .delete(`/department/${id}`)
    .then((response) => response.data);
};

export const updateDepartment = (course, id) => {
  return private_axios_url
    .put(`/department/${id}`, course)
    .then((response) => response.data);
};

export const getCoursesByStatus = (status) => {
  console.log("Status:", status);
  return private_axios_url
    .get(`/department/status/${status}`)
    .then((response) => response.data);
};
