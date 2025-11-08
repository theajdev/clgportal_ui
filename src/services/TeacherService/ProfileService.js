import { private_axios_url } from "../base";

//get teacher profile by id
export const getTeacherProfile = (id) => {
  return private_axios_url
    .get(`/teacher/${id}`)
    .then((response) => response.data);
};

//upload teacher profile image
export const uploadTeacherProfile = (image, teacherId) => {
  let formData = new FormData();
  formData.append("image", image);
  return private_axios_url
    .post(`/teacher/profile/upload/${teacherId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

//add new teacher
export const addTeacher = (teacher) => {
  return private_axios_url
    .post("/teacher/", teacher)
    .then((response) => response.data);
};

//update teacher profile
export const updateTeacherProfile = (teacher, teacherId) => {
  return private_axios_url
    .put(`/teacher/${teacherId}`, teacher)
    .then((response) => response.data);
};

//get profile image
export const getTeacherProfileImage = (imageName) => {
  return private_axios_url
    .get(`/teacher/profile/image/${imageName}`, { responseType: "blob" })
    .then((response) => response.data);
};
