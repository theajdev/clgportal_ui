import { private_axios_url } from "../base";

const getAllSubjects = () => {
  return private_axios_url.get("/subject/").then((response) => response.data);
};
export { getAllSubjects };
