import axios from "axios";

const AUTH_REST_API_BASE_URL = 'https://clgportal-api.onrender.com/api/auth';
//const AUTH_REST_API_BASE_URL = 'http://172.31.224.1:2025/api/auth'
export const loginAPICall = (usernameOrEmail, password) => axios.post(AUTH_REST_API_BASE_URL + '/login', { usernameOrEmail, password });
export const storeToken = (token) => localStorage.setItem("token", token);
export const getToken = (token) => localStorage.getItem("token");
export const saveLoggedInUsers = (username) => sessionStorage.setItem("authenticatedUser", username);
export const isUserLoggedIn = () => {
    const username = sessionStorage.getItem("authenticatedUser");
    if (username == null) {

        return false;
    } else {

        return true;
    }
}

export const loggedInUser = () => {
    const username = sessionStorage.getItem("authenticatedUser");
    return username;
}

export const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload(false);
}