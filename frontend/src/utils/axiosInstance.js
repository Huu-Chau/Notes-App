import axios from "axios"
import {BASE_URL} from './constants'

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
    headers: {
        "content-type": "application/json"
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token")
        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
