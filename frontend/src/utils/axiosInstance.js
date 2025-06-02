import axios, { isAxiosError } from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true // Enable sending cookies
})


//Response Interceptor
axiosInstance.interceptors.response.use(
(response)=>{
        return response;
    },
    (error)=>{
        if(error.response){
            const {status, data}=error.response;
            switch (status) {
                case 400:
                    console.error("Bad Request:", data)
                    break;
                case 401:
                    console.error("Unauthorized:", data)
                    break;
                case 403:
                    console.error("Forbidden:", data)
                    break;
                case 404:
                    console.error("Not Found", data)
                    break;
                case 500:
                    console.error("Server Error", data)
                    break;
                default:
                    console.error(`Error (${status}):`, data)
                    break;
            }
        } else if (error.request){
            console.error("Network Error: No response recieved", error.request);
        }else{
            console.error("Error:", error.message)
        }
        return Promise.reject({
            isAxiosError: true,
            message: error.response?.data?.message ||error.message|| "Unknown error Occurred",
            status: error.response?.status,
            data: error.response?.data,
            originalError: error,
    });
    }
)


export default axiosInstance