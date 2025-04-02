import axios, {AxiosInstance} from "axios"

export const BASE_URL = "https://localhost:3000/";

export const endpoints = {
    register: "/users/register/",
    login:"/users/login/"
};

export const authAPIs = (token: string): AxiosInstance => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};


export const api = axios.create({
    baseURL: BASE_URL,
});

