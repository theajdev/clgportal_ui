import axios from "axios";
import { getToken } from "./auth";

//const AUTH_REST_API_BASE_URL = 'https://clgportal-api.onrender.com/api/auth';
//export const BASE_URL = "https://ajtechsoft.qzz.io:8443/clgportal-api/api";
export const BASE_URL = "http://10.116.205.225:2025/api/";
//export const BASE_URL = "http://10.223.26.225:2024/clgportal-api/api";
export const axios_url = axios.create({ baseURL: BASE_URL });

axios.defaults.withCredentials = true;

export const private_axios_url = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

private_axios_url.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }
  },
  (error) => Promise.reject(error)
);
