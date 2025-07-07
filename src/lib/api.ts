// lib/api.ts
import axios from 'axios'
import { getDataFromToken, getItemLocalStore } from 'hooks/useLocalStore'


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 🛡️ Interceptor để tự thêm Authorization nếu có token
api.interceptors.request.use((config) => {
    const token = getItemLocalStore('^token')
    const user = getDataFromToken(token)
    if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`
    }
    return config
})

export default api
