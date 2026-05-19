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

const submitWithMethodOverride = (url: string, method: string, data: any = {}) => {
  const formData = new URLSearchParams()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  })
  formData.append('_method', method)

  return apiClient.post(url, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

const LOCAL_PRODUCTS_KEY = 'mealjun_local_products'
const DELETED_PRODUCTS_KEY = 'mealjun_deleted_products'
const PRODUCT_CACHE_KEY = 'mealjun_product_cache'

const getStoredProducts = () => {
  return JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || '[]')
}

const setStoredProducts = (products: any[]) => {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products))
}

const getDeletedProductIds = () => {
  return JSON.parse(localStorage.getItem(DELETED_PRODUCTS_KEY) || '[]')
}

const setDeletedProductIds = (ids: string[]) => {
  localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(ids))
}

const cacheProducts = (products: any[]) => {
  localStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(products))
}

const getCachedProducts = () => {
  return JSON.parse(localStorage.getItem(PRODUCT_CACHE_KEY) || '[]')
}

const mergeProductLists = (remoteProducts: any[] = []) => {
  const deletedIds = getDeletedProductIds()
  const localProducts = getStoredProducts()
  const localProductMap = new Map(
    localProducts.map((product: any) => [String(product.id), product])
  )

  const mergedProducts = remoteProducts
    .filter((product) => !deletedIds.includes(String(product.id)))
    .map((product) => localProductMap.get(String(product.id)) || product)

  localProducts.forEach((product: any) => {
    const productId = String(product.id)
    const existsInRemote = remoteProducts.some(
      (remoteProduct) => String(remoteProduct.id) === productId
    )

    if (!existsInRemote && !deletedIds.includes(productId)) {
      mergedProducts.unshift(product)
    }
  })

  cacheProducts(mergedProducts)
  return mergedProducts
}

const saveLocalProduct = (product: any) => {
  const products = getStoredProducts()
  const productId = String(product.id)
  const nextProducts = products.some((item: any) => String(item.id) === productId)
    ? products.map((item: any) =>
        String(item.id) === productId ? { ...item, ...product } : item
      )
    : [product, ...products]

  setStoredProducts(nextProducts)
  return product
}

const createLocalProduct = (data: any) => {
  const product = {
    ...data,
    id: `local-${Date.now()}`,
    image_url: data.image_base64 || data.image_url || '',
    price: String(data.price || '0'),
    stock_status: data.stock_status || 'available',
    is_featured: false,
  }
  delete product.image_base64

  return saveLocalProduct(product)
}

const updateLocalProduct = (id: string, data: any) => {
  const cachedProduct = getCachedProducts().find(
    (product: any) => String(product.id) === String(id)
  )
  const existingProduct =
    getStoredProducts().find((product: any) => String(product.id) === String(id)) ||
    cachedProduct ||
    {}
  const product = {
    ...existingProduct,
    ...data,
    id,
    image_url: data.image_base64 || data.image_url || existingProduct.image_url || '',
  }
  delete product.image_base64

  return saveLocalProduct(product)
}

const deleteLocalProduct = (id: string) => {
  const productId = String(id)
  setStoredProducts(
    getStoredProducts().filter((product: any) => String(product.id) !== productId)
  )
  setDeletedProductIds([...new Set([...getDeletedProductIds(), productId])])
}

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
  getPublicProducts: async (params?: any) => {
    try {
      const response = await apiClient.get('/public/products', { params })
      const products = mergeProductLists(response.data.data || response.data || [])
      return { ...response, data: { ...response.data, data: products } }
    } catch {
      return { data: { data: mergeProductLists([]) } }
    }
  },
  getPublicProductById: (id: string) => apiClient.get(`/public/products/${id}`),

  // Admin endpoints
  getProducts: async (params?: any) => {
    try {
      const response = await apiClient.get('/products', { params })
      const products = mergeProductLists(response.data.data || response.data || [])
      return { ...response, data: { ...response.data, data: products } }
    } catch {
      return { data: { data: mergeProductLists([]) } }
    }
  },
  getProductById: (id: string) => apiClient.get(`/products/${id}`),
  createProduct: async (data: any) => {
    try {
      return await apiClient.post('/products', data)
    } catch {
      const product = createLocalProduct(data)
      return { data: { data: product } }
    }
  },
  updateProduct: async (id: string, data: any) => {
    try {
      return await submitWithMethodOverride(`/products/${id}`, 'PUT', data)
    } catch {
      const product = updateLocalProduct(id, data)
      return { data: { data: product } }
    }
  },
  deleteProduct: async (id: string) => {
    try {
      await submitWithMethodOverride(`/products/${id}`, 'DELETE')
    } finally {
      deleteLocalProduct(id)
    }
    return { data: { success: true } }
  },
  toggleFeatured: async (id: string) => {
    try {
      return await submitWithMethodOverride(`/products/${id}/toggle-featured`, 'PATCH')
    } catch {
      const product =
        getCachedProducts().find((item: any) => String(item.id) === String(id)) ||
        getStoredProducts().find((item: any) => String(item.id) === String(id)) ||
        {}
      return { data: { data: updateLocalProduct(id, { is_featured: !product.is_featured }) } }
    }
  },
  updateStockStatus: async (id: string, status: string) => {
    try {
      return await submitWithMethodOverride(`/products/${id}/stock-status`, 'PATCH', {
        stock_status: status,
      })
    } catch {
      return { data: { data: updateLocalProduct(id, { stock_status: status }) } }
    }
  },
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
  updateAbout: (data: any) => {
    const formData = new URLSearchParams()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })
    formData.append('_method', 'PUT')

    return apiClient.post('/about', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  },
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
