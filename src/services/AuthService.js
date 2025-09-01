import { axios_url } from "./base";

export const loginUser = (user) => {
  return axios_url.post("/auth/login", user).then((response) => response.data);
};
