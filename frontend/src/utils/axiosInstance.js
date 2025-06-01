import axios, { isAxiosError } from "axios";

const axiosInstance = axios.create({baseURL: "http://localhost:3000/"})


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