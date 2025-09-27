import { private_axios_url } from "../base";

export const getAllNotices = () => {
  return private_axios_url.get(`/notice/`).then((response) => response.data);
};
