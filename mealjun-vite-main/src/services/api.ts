import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  },
)

// ============ AUTHENTICATION ============
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
}

// ============ PRODUCTS ============
export const productsAPI = {
  // Public endpoints
  getPublicProducts: (params?: any) =>
    apiClient.get('/public/products', { params }),
  getPublicProductById: (id: string) => apiClient.get(`/public/products/${id}`),

  // Admin endpoints
  getProducts: (params?: any) => apiClient.get('/products', { params }),
  getProductById: (id: string) => apiClient.get(`/products/${id}`),
  createProduct: (data: any) => apiClient.post('/products', data),
  updateProduct: (id: string, data: any) =>
    apiClient.put(`/products/${id}`, data),
  deleteProduct: (id: string) => apiClient.delete(`/products/${id}`),
  toggleFeatured: (id: string) =>
    apiClient.patch(`/products/${id}/toggle-featured`),
  updateStockStatus: (id: string, status: string) =>
    apiClient.patch(`/products/${id}/stock-status`, { stock_status: status }),
}

// ============ TESTIMONIALS ============
export const testimonialsAPI = {
  // Public endpoints
  getPublicTestimonials: () => apiClient.get('/public/testimonials'),

  // Admin endpoints
  getTestimonials: () => apiClient.get('/testimonials'),
  getTestimonialById: (id: string) => apiClient.get(`/testimonials/${id}`),
  createTestimonial: (data: any) => apiClient.post('/testimonials', data),
  updateTestimonial: (id: string, data: any) =>
    apiClient.put(`/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => apiClient.delete(`/testimonials/${id}`),
  toggleFeatured: (id: string) =>
    apiClient.patch(`/testimonials/${id}/toggle-featured`),
  toggleApproved: (id: string) =>
    apiClient.patch(`/testimonials/${id}/toggle-approved`),
}

// ============ GALLERY ============
export const galleryAPI = {
  // Public endpoints
  getPublicGallery: () => apiClient.get('/public/gallery'),

  // Admin endpoints
  getGallery: () => apiClient.get('/gallery'),
  getGalleryById: (id: string) => apiClient.get(`/gallery/${id}`),
  createGalleryImage: (data: any) => apiClient.post('/gallery', data),
  updateGalleryImage: (id: string, data: any) =>
    apiClient.put(`/gallery/${id}`, data),
  deleteGalleryImage: (id: string) => apiClient.delete(`/gallery/${id}`),
  reorderGallery: (data: any) => apiClient.patch('/gallery/reorder', data),
}

// ============ STORE LOCATIONS ============
export const storeLocationsAPI = {
  // Public endpoints
  getPublicStoreLocations: () => apiClient.get('/public/store-locations'),

  // Admin endpoints
  getStoreLocations: () => apiClient.get('/store-locations'),
  getStoreLocationById: (id: string) => apiClient.get(`/store-locations/${id}`),
  createStoreLocation: (data: any) => apiClient.post('/store-locations', data),
  updateStoreLocation: (id: string, data: any) =>
    apiClient.put(`/store-locations/${id}`, data),
  deleteStoreLocation: (id: string) =>
    apiClient.post(
      `/store-locations/${id}`,
      new URLSearchParams({ _method: 'DELETE' }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    ),
}

// ============ CONTACT MESSAGES ============
export const contactMessagesAPI = {
  // Public endpoints
  submitContactForm: (data: any) => apiClient.post('/public/contact', data),

  // Admin endpoints
  getContactMessages: (params?: any) =>
    apiClient.get('/contact-messages', { params }),
  getContactMessageById: (id: string) =>
    apiClient.get(`/contact-messages/${id}`),
  replyToContactMessage: (id: string, data: any) =>
    apiClient.post(`/contact-messages/${id}/reply`, data),
  markAsRead: (id: string) => apiClient.patch(`/contact-messages/${id}/read`),
  deleteContactMessage: (id: string) =>
    apiClient.delete(`/contact-messages/${id}`),
}

// ============ ABOUT INFO ============
export const aboutAPI = {
  getPublicAbout: () => apiClient.get('/public/about'),
  updateAbout: (data: any) => apiClient.put('/about', data),
}

// ============ DASHBOARD & ANALYTICS ============
export const dashboardAPI = {
  getDashboard: () => apiClient.get('/dashboard'),
  getAnalytics: (page: number = 1) =>
    apiClient.get('/analytics', { params: { page } }),
}

// ============ PUBLIC ANALYTICS TRACKING ============
export const analyticsTrackingAPI = {
  trackVisitor: (data: {
    visitor_city: string
    visitor_province: string
    visitor_country: string
  }) => apiClient.post('/public/analytics/track', data),
}

export default apiClient
