import axios from 'axios'
import axiosInstance from '../utils/axiosInstance'

export const createShortUrl=(url, customId)=>{
    return axiosInstance.post("/api/create", {
        url: fullUrl,
        customId: customId || undefined // Only send if not empty 
      })
}