import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 1000,
    headers:{
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
});
axiosInstance.interceptors.request.use(function(config) {
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return config
})