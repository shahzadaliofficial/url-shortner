import axiosInstance from '../utils/axiosInstance'

export const createShortUrl = (url, customId) => {
    return axiosInstance.post("/api/create", {
        url: url,
        customId: customId || undefined // Only send if not empty 
    })
}

export const createCustomShortUrl = (url, customId) => {
    return axiosInstance.post("/api/create/custom", {
        url: url,
        customId: customId
    })
}