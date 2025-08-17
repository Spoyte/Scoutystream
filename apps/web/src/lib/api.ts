import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor to handle 402 Payment Required responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 402) {
      // Forward 402 responses to be handled by useX402 hook
      return Promise.reject({ 
        isPaymentRequired: true, 
        response: error.response,
        ...error 
      })
    }
    return Promise.reject(error)
  }
)

export default api
