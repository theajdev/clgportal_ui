import axios from "axios";
import { getToken } from "./auth";

//const AUTH_REST_API_BASE_URL = 'https://clgportal-api.onrender.com/api/auth';
export const BASE_URL = "https://www.ajtechsoft.qzz.io/clgportal-api/api";
export const axios_url = axios.create({ baseURL: BASE_URL });
export const private_axios_url = axios.create({ baseURL: BASE_URL });

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
