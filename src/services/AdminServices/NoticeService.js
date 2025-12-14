import { private_axios_url } from "../base";

export const getAllNotices = () => {
  return private_axios_url.get(`/notice/`).then((response) => response.data);
};

export const createNotice = (notice) => {
  return private_axios_url
    .post(`/notice/`, notice)
    .then((response) => response.data);
};

export const updateNotice = (id, notice) => {
  return private_axios_url
    .put(`/notice/${id}`, notice)
    .then((response) => response.data);
};

export const getNoticeByStatus = (st) => {
  return private_axios_url
    .get(`/notice/status/${st}`)
    .then((response) => response.data);
};

export const deleteNotice = (id) => {
  return private_axios_url
    .delete(`/notice/${id}`)
    .then((response) => response.data);
};

export const getNoticeCount = () => {
  return private_axios_url
    .get(`/notice/count`)
    .then((response) => response.data);
};

export const getNoticeByDepts = (id) => {
  return private_axios_url
    .get(`/notice/depts/${id}`)
    .then((response) => response.data);
};

export const readNotice = (noticeId, userId, userType) => {
  return private_axios_url
    .post(`/notice/${noticeId}/read/${userId}?userType=${userType}`)
    .then((response) => response.data);
};

export const getNoticeReadDetails = (noticeId) => {
  return private_axios_url
    .get(`/notice/read/${noticeId}`)
    .then((response) => response.data);
};
