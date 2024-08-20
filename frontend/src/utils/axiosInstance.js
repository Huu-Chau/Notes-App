import axios from "axios"
const API_URL = process.env.VITE_APP_BASE_URL

export const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 1000,
    headers: {
        "content-type": "application/json"
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token")
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
