import { private_axios_url } from "../base";

export const getAllUserTypes = () => {
  return private_axios_url.get("/role/").then((response) => response.data);
};

export const getUserTypesByStatus = (status) => {
  return private_axios_url
    .get(`/role/status/${status}`)
    .then((response) => response.data);
};

export const addNewRole = (role) => {
  return private_axios_url
    .post("/role/", role)
    .then((response) => response.data);
};

export const UpdateRole = (role, id) => {
  return private_axios_url
    .put(`/role/${id}`, role)
    .then((response) => response.data);
};

export const deleteRole = (id) => {
  return private_axios_url
    .delete(`/role/${id}`)
    .then((response) => response.data);
};

export const getRoleCount = () => {
  return private_axios_url.get("/role/count").then((response) => response.data);
};
