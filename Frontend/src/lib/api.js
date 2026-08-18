// Empty VITE_API_BASE_URL means same-origin requests via the reverse proxy (/api/...).
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")

class ApiError extends Error {
  constructor(message, statusCode, errors) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
    this.errors = errors
  }
}

// Helper function to get auth token from localStorage
function getAuthToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

// Helper function to handle API responses
async function handleResponse(response) {
  const contentType = response.headers.get("content-type")

  if (!response.ok) {
    if (contentType?.includes("application/json")) {
      const error = await response.json()
      throw new ApiError(error.message || "An error occurred", response.status, error.errors)
    }
    throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status)
  }

  if (contentType?.includes("application/json")) {
    return response.json()
  }

  return response.text()
}

// Generic fetch wrapper
async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken()

  const headers = {
    ...options.headers,
  }

  // Add auth token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // Add content-type for JSON requests
  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  return handleResponse(response)
}

// Auth API
export const authApi = {
  // Register new user
   async register(data) {
    const formData = new FormData()
    
    // Use EXACT field names from API documentation (case-sensitive!)
    formData.append("Name", data.name)
    formData.append("Nickname", data.nickname)
    formData.append("Email", data.email)
    formData.append("UserName", data.userName)
    formData.append("Password", data.password)
    formData.append("ConfirmPassword", data.confirmPassword)
    formData.append("Phone", data.phone)

    if (data.dateOfBirth) {
      const dateObj = new Date(data.dateOfBirth)
      formData.append("DateOfBirth", dateObj.toISOString())
    }
    
    if (data.gender) {
      formData.append("Gender", data.gender.toString())
    }
    
    if (data.photo) {
      formData.append("Photo", data.photo)
    }

    console.log("[v0] FormData entries:")
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value)
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/User/Register`, {
        method: "POST",
        body: formData,
        mode: 'cors', 
        credentials: 'include', 
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response headers:", [...response.headers.entries()])

      if (!response.ok) {
        // Try to parse the error response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        let errorDetails = {}
        
        try {
          const errorData = await response.json()
          console.log("[v0] Error response:", errorData)
          
          // Check for validation errors (like the one you showed)
          if (errorData.errors) {
            // Format validation errors into a readable message
            const validationMessages = []
            for (const [field, messages] of Object.entries(errorData.errors)) {
              if (Array.isArray(messages)) {
                validationMessages.push(`${field}: ${messages.join(', ')}`)
              } else {
                validationMessages.push(`${field}: ${messages}`)
              }
            }
            errorMessage = validationMessages.join('. ')
            errorDetails = errorData.errors
          } else if (errorData.title) {
            errorMessage = errorData.title
            if (errorData.detail) {
              errorMessage += `: ${errorData.detail}`
            }
          } else if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch (parseError) {
          // If response is not JSON, try to get text
          try {
            const textError = await response.text()
            if (textError) {
              errorMessage = textError
            }
          } catch (textError) {
            // Fallback to default error message
          }
        }
        
        // Throw an error with both the message and details
        const apiError = new ApiError(errorMessage, response.status)
        apiError.details = errorDetails
        throw apiError
      }

      const result = await response.json()
      console.log("[v0] Registration successful:", result)
      return result
      
    } catch (error) {
      console.error("[v0] Fetch error:", error)
      
      // Provide a more helpful error message for network errors
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error(
          'Cannot connect to server. Please check your internet connection and try again.'
        )
      }
      throw error
    }
  },

  // Login with email and password
  async login(email, password) {
    return apiFetch("/api/User/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  // Forgot password - sends OTP to email
  async forgotPassword(email) {
    return apiFetch("/api/User/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },

  // Verify OTP code
  async verifyOtp(email, code) {
    return apiFetch("/api/User/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    })
  },

  // Reset password after OTP verification
  async resetPassword(email, code, newPassword, confirmPassword) {
    return apiFetch("/api/User/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: email.trim(),
        Code: code.trim(),
        NewPassword: newPassword,
        ConfirmPassword: confirmPassword
      }),
      credentials: 'include',
    })
  },

  // Google OAuth - initiate sign in
  getGoogleSignInUrl() {
    return `${API_BASE_URL}/api/OAuth/signin-google`
  },
}

// User API - for profile management
export const userApi = {
  // Get user profile
  async getProfile() {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token found')
    }
    
    const response = await fetch(`${API_BASE_URL}/api/User/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("authToken")
        throw new Error('Session expired. Please login again.')
      }
      const error = await response.text().catch(() => null)
      throw new Error(error || `HTTP ${response.status}: Failed to get profile`)
    }
    
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return response.json()
    }
    return null
  },

  // Edit user profile
  async editProfile(formData) {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token found')
    }
    
    const response = await fetch(`${API_BASE_URL}/api/User/edit-profile`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("authToken")
        throw new Error('Session expired. Please login again.')
      }
      const error = await response.text().catch(() => null)
      throw new Error(error || `HTTP ${response.status}: Failed to update profile`)
    }
    
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return response.json()
    }
    return null
  },
}

// Doctor API
// export const doctorApi = {
//   // Get all doctors
//   async getAllDoctors() {
//     return apiFetch("/api/Doctor/All", {
//       method: "GET",
//     })
//   },

//   // Search doctors by name
//   async searchByName(name) {
//     return apiFetch(`/api/Doctor/by-name?name=${encodeURIComponent(name)}`, {
//       method: "GET",
//     })
//   },

//   // Get doctor by ID
//   async getDoctorById(doctorId) {
//     return apiFetch(`/api/DoctorDetails/${doctorId}`, {
//       method: "GET",
//     })
//   },

//   // Get doctors by category
//   async getDoctorsByCategory(categoryId) {
//     return apiFetch(`/api/Doctor/by-category/${categoryId}`, {
//       method: "GET",
//     })
//   },
// }
// Add this to your existing doctorApi in api.js

// Doctor Details API (add to existing doctorApi)
export const doctorApi = {
  // Get all doctors
  async getAllDoctors() {
    return apiFetch("/api/Doctor/All", {
      method: "GET",
    })
  },

  // Search doctors by name
  async searchByName(name) {
    return apiFetch(`/api/Doctor/by-name?name=${encodeURIComponent(name)}`, {
      method: "GET",
    })
  },

  // Get doctor by ID
  async getDoctorById(doctorId) {
    return apiFetch(`/api/DoctorDetails/${doctorId}`, {
      method: "GET",
    })
  },

  // Get doctors by category
  async getDoctorsByCategory(categoryId) {
    return apiFetch(`/api/Doctor/by-category/${categoryId}`, {
      method: "GET",
    })
  },

  // Get non-available appointment times for a doctor
  async getNonAvailableTimes(doctorId, date) {
    return apiFetch(`/api/Appointment/non-available/${doctorId}?date=${date}`, {
      method: "GET",
    })
  },
}
//Appointment/Booking API
// export const bookingApi = {
//   // Get user's bookings with optional status filter
//   async getMyBookings(status = null) {
//     let endpoint = "/api/Appointment/MyBooking"
//     if (status) {
//       endpoint += `?status=${status}`
//     }
//     return apiFetch(endpoint, {
//       method: "GET",
//     })
//   },

//   // Cancel a booking
//   async cancelBooking(bookingId) {
//     return apiFetch(`/api/Appointment/cancel/${bookingId}`, {
//       method: "PUT",
//     })
//   },

//   // Reschedule a booking
//   async rescheduleBooking(bookingId, updateData) {
//     return apiFetch(`/api/Appointment/${bookingId}`, {
//       method: "PUT",
//       body: JSON.stringify(updateData),
//     })
//   },

//   // Create a new appointment/booking
// async createBooking(doctorId, bookingData) {
//     return apiFetch(`/api/Appointment/${doctorId}`, {
//       method: "POST",
//       body: JSON.stringify(bookingData),
//     })
//   },
//   // Get booking details by ID
//   async getBookingById(bookingId) {
//     return apiFetch(`/api/Appointment/${bookingId}`, {
//       method: "GET",
//     })
//   },

//   // Get all appointments (admin only)
//   async getAllAppointments() {
//     return apiFetch("/api/Appointment", {
//       method: "GET",
//     })
//   },
// }
// In api.js, update bookingApi
// export const bookingApi = {
//   // Get user's bookings with status parameter (as required by API)
//   async getMyBookings(status) {
//     // The API requires a status field - send it as a query parameter
//     return apiFetch(`/api/Appointment/MyBooking?status=${encodeURIComponent(status)}`, {
//       method: "GET",
//     })
//   },

//   // Alternative method without status (if needed)
//   async getMyBookingsWithoutStatus() {
//     return apiFetch("/api/Appointment/MyBooking", {
//       method: "GET",
//     })
//   },

//   // Cancel a booking
//   async cancelBooking(bookingId) {
//     return apiFetch(`/api/Appointment/cancel/${bookingId}`, {
//       method: "PUT",
//     })
//   },

//   // Reschedule a booking
//   async rescheduleBooking(bookingId, updateData) {
//     return apiFetch(`/api/Appointment/${bookingId}`, {
//       method: "PUT",
//       body: JSON.stringify(updateData),
//     })
//   },

//   // Create a new appointment/booking
//   async createBooking(doctorId, bookingData) {
//     return apiFetch(`/api/Appointment/${doctorId}`, {
//       method: "POST",
//       body: JSON.stringify(bookingData),
//     })
//   },

//   // Get booking details by ID
//   async getBookingById(bookingId) {
//     return apiFetch(`/api/Appointment/${bookingId}`, {
//       method: "GET",
//     })
//   },

//   // Get all appointments (admin only)
//   async getAllAppointments() {
//     return apiFetch("/api/Appointment", {
//       method: "GET",
//     })
//   },
// }
//Update the bookingApi.createBooking method to accept doctorId as parameter
// In api.js, make sure the bookingApi.getMyBookings method is correct
// In api.js, update the bookingApi.getMyBookings method
export const bookingApi = {
  // Get user's bookings with status parameter
  async getMyBookings(status) {
    // Make sure status is passed as query parameter
    const endpoint = status 
      ? `/api/Appointment/MyBooking?status=${encodeURIComponent(status)}`
      : "/api/Appointment/MyBooking"
    
    return apiFetch(endpoint, {
      method: "GET",
    })
  },

  // Cancel a booking
  async cancelBooking(bookingId) {
    return apiFetch(`/api/Appointment/cancel/${bookingId}`, {
      method: "PUT",
    })
  },

  // Reschedule a booking
  async rescheduleBooking(bookingId, updateData) {
    return apiFetch(`/api/Appointment/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    })
  },

  // Create a new appointment/booking
  async createBooking(doctorId, bookingData) {
    return apiFetch(`/api/Appointment/${doctorId}`, {
      method: "POST",
      body: JSON.stringify(bookingData),
    })
  },

  // Get booking details by ID
  async getBookingById(bookingId) {
    return apiFetch(`/api/Appointment/${bookingId}`, {
      method: "GET",
    })
  },

  // Get all appointments (admin only)
  async getAllAppointments() {
    return apiFetch("/api/Appointment", {
      method: "GET",
    })
  },
}
// export const bookingApi = {
//   // Create a new appointment/booking
//   async createBooking(doctorId, bookingData) {
//     return apiFetch(`/api/Appointment/${doctorId}`, {
//       method: "POST",
//       body: JSON.stringify(bookingData),
//     })
//   },
  
//   // ... rest of the bookingApi methods remain the same
// }
// Favourite API
export const favouriteApi = {
  // Add doctor to favourites
  async addFavourite(doctorId) {
    return apiFetch("/api/Favourite/AddToFav", {
      method: "POST",
      body: JSON.stringify({ doctorId }),
    })
  },

  // Get user's favourites
  async getUserFavourites() {
    return apiFetch("/api/Favourite/GetFavourites", {
      method: "GET",
    })
  },

  // Remove from favourites
  async removeFavourite(id) {
    return apiFetch(`/api/Favourite/${id}`, {
      method: "DELETE",
    })
  },
}
//admin dashboard 
// Add to your api.js file

// Admin/Doctor Dashboard API
// Admin/Doctor Dashboard API - Fixed for your endpoints
export const dashboardApi = {
  // Login for doctor/admin dashboard
  async login(code, password) {
    return apiFetch("/api/Dashboard_Doctor/login", {
      method: "POST",
      body: JSON.stringify({ code, password }),
    })
  },

  // Get doctor profile
  async getProfile() {
    return apiFetch("/api/Dashboard_Doctor/profileDoctor", {
      method: "GET",
    })
  },

  // Get doctor's bookings with optional status filter
  async getMyBookings(status = null) {
    let endpoint = "/api/Dashboard_Doctor/my-bookings"
    if (status) {
      endpoint += `?status=${status}`
    }
    return apiFetch(endpoint, {
      method: "GET",
    })
  },

  // Update booking status (confirm, cancel, complete)
  async updateBookingStatus(bookingId, status) {
    return apiFetch(`/api/Dashboard_Doctor/booking-status/${bookingId}?status=${status}`, {
      method: "PUT",
    })
  },
}
// Notification API
export const notificationApi = {
  // Get all notifications
  async getNotifications() {
    try {
      const response = await apiFetch("/api/Notification", {
        method: "GET",
      })
      return response
    } catch (error) {
      console.error("[v0] Error fetching notifications:", error)
      throw error
    }
  },

  // Mark a single notification as read
  async markAsRead(notificationId) {
    try {
      const response = await apiFetch(`/api/Notification/mark-as-read/${notificationId}`, {
        method: "PUT",
      })
      return response
    } catch (error) {
      console.error("[v0] Error marking notification as read:", error)
      throw error
    }
  },

  // Delete a notification
  async deleteNotification(notificationId) {
    try {
      const response = await apiFetch(`/api/Notification/${notificationId}`, {
        method: "DELETE",
      })
      return response
    } catch (error) {
      console.error("[v0] Error deleting notification:", error)
      throw error
    }
  },
}

export const chatApi = {
  async triage(messages) {
    return apiFetch("/api/Chat/triage", {
      method: "POST",
      body: JSON.stringify({ messages }),
    })
  },
}

export { ApiError }