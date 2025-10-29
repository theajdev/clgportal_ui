import { private_axios_url } from "../base";

export const teacherProfile = (id) => {
  return private_axios_url
    .get(`/teacher/${id}`)
    .then((response) => response.data);
};
