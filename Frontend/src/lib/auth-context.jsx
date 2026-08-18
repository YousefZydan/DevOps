

// // // import { createContext, useContext, useState, useEffect } from "react"
// // // import { authApi } from "./api"

// // // const AuthContext = createContext(undefined)

// // // export function AuthProvider({ children }) {
// // //   const [user, setUser] = useState(null)
// // //   const [isLoading, setIsLoading] = useState(true)

// // //   useEffect(() => {
// // //     const loadUser = async () => {
// // //       const token = localStorage.getItem("authToken")
// // //       if (token) {
// // //         try {
// // //           const userData = await authApi.getProfile()
// // //           setUser(userData)
// // //         } catch (error) {
// // //           console.error("[v0] Failed to load user:", error)
// // //           localStorage.removeItem("authToken")
// // //         }
// // //       }
// // //       setIsLoading(false)
// // //     }

// // //     loadUser()
// // //   }, [])

// // //   const login = async (email, password) => {
// // //     const response = await authApi.login(email, password)

// // //     console.log("[v0] Login response:", response)

// // //     if (response.token) {
// // //       localStorage.setItem("authToken", response.token)
// // //       const userData = await authApi.getProfile()
// // //       setUser(userData)
// // //     }
// // //   }

// // //   const setToken = async (token) => {
// // //     try {
// // //       console.log("[v0] Setting OAuth token")
// // //       localStorage.setItem("authToken", token)
// // //       const userData = await authApi.getProfile()
// // //       setUser(userData)
// // //       console.log("[v0] OAuth login successful, user:", userData)
// // //     } catch (error) {
// // //       console.error("[v0] Failed to fetch user profile after OAuth:", error)
// // //       localStorage.removeItem("authToken")
// // //       throw error
// // //     }
// // //   }

// // //   const register = async (data) => {
// // //     console.log("[v0] Registration data being sent:", {
// // //       ...data,
// // //       password: "***",
// // //       confirmPassword: "***",
// // //     })

// // //     const response = await authApi.register(data)

// // //     console.log("[v0] Register response:", response)

// // //     if (response.token) {
// // //       localStorage.setItem("authToken", response.token)
// // //       const userData = await authApi.getProfile()
// // //       setUser(userData)
// // //     } else if (response.data?.token) {
// // //       localStorage.setItem("authToken", response.data.token)
// // //       const userData = await authApi.getProfile()
// // //       setUser(userData)
// // //     }
// // //   }

// // //   const logout = () => {
// // //     localStorage.removeItem("authToken")
// // //     setUser(null)
// // //   }

// // //   const refreshUser = async () => {
// // //     try {
// // //       const userData = await authApi.getProfile()
// // //       setUser(userData)
// // //     } catch (error) {
// // //       console.error("[v0] Failed to refresh user:", error)
// // //     }
// // //   }

// // //   return (
// // //     <AuthContext.Provider
// // //       value={{
// // //         user,
// // //         isLoading,
// // //         isAuthenticated: !!user,
// // //         login,
// // //         logout,
// // //         register,
// // //         refreshUser,
// // //         setToken,
// // //       }}
// // //     >
// // //       {children}
// // //     </AuthContext.Provider>
// // //   )
// // // }

// // // export function useAuth() {
// // //   const context = useContext(AuthContext)
// // //   if (context === undefined) {
// // //     throw new Error("useAuth must be used within an AuthProvider")
// // //   }
// // //   return context
// // // }
// // // auth-context.js
// // import { createContext, useContext, useState, useEffect } from "react"
// // import { authApi } from "./api"

// // const AuthContext = createContext(undefined)

// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null)
// //   const [isLoading, setIsLoading] = useState(true)

// //   useEffect(() => {
// //     const loadUser = async () => {
// //       const token = localStorage.getItem("authToken")
// //       if (token) {
// //         try {
// //           const userData = await authApi.getProfile()
// //           setUser(userData)
// //         } catch (error) {
// //           console.error("[v0] Failed to load user:", error)
// //           localStorage.removeItem("authToken")
// //         }
// //       }
// //       setIsLoading(false)
// //     }

// //     loadUser()
// //   }, [])

// //   const login = async (email, password) => {
// //     const response = await authApi.login(email, password)
// //     console.log("[v0] Login response:", response)

// //     if (response.token) {
// //       localStorage.setItem("authToken", response.token)
// //       const userData = await authApi.getProfile()
// //       setUser(userData)
// //     }
// //   }

// //   // Add this function for Google OAuth
// //   const loginWithGoogle = async () => {
// //     try {
// //       // Redirect to backend OAuth endpoint
// //       window.location.href = `${import.meta.env.VITE_API_BASE_URL}/OAuth/signin-google`
// //     } catch (error) {
// //       console.error("[v0] Google login redirect error:", error)
// //       throw error
// //     }
// //   }

// //   // Add this function to handle Google ID token directly
// //   const loginWithGoogleToken = async (idToken) => {
// //     try {
// //       console.log("[v0] Sending Google ID token to backend:", idToken)
      
// //       // Send ID token to your backend endpoint
// //       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/OAuth/signin-google`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ idToken })
// //       })

// //       if (!response.ok) {
// //         throw new Error('Google login failed')
// //       }

// //       const data = await response.json()
// //       console.log("[v0] Google login response:", data)

// //       if (data.token) {
// //         localStorage.setItem("authToken", data.token)
// //         const userData = await authApi.getProfile()
// //         setUser(userData)
// //         return data
// //       } else {
// //         throw new Error('No token received from Google login')
// //       }
// //     } catch (error) {
// //       console.error("[v0] Google login error:", error)
// //       throw error
// //     }
// //   }

// //   const setToken = async (token) => {
// //     try {
// //       console.log("[v0] Setting OAuth token")
// //       localStorage.setItem("authToken", token)
// //       const userData = await authApi.getProfile()
// //       setUser(userData)
// //       console.log("[v0] OAuth login successful, user:", userData)
// //     } catch (error) {
// //       console.error("[v0] Failed to fetch user profile after OAuth:", error)
// //       localStorage.removeItem("authToken")
// //       throw error
// //     }
// //   }

// //   const register = async (data) => {
// //     console.log("[v0] Registration data being sent:", {
// //       ...data,
// //       password: "***",
// //       confirmPassword: "***",
// //     })

// //     const response = await authApi.register(data)
// //     console.log("[v0] Register response:", response)

// //     if (response.token) {
// //       localStorage.setItem("authToken", response.token)
// //       const userData = await authApi.getProfile()
// //       setUser(userData)
// //     } else if (response.data?.token) {
// //       localStorage.setItem("authToken", response.data.token)
// //       const userData = await authApi.getProfile()
// //       setUser(userData)
// //     }
// //   }

// //   const logout = () => {
// //     localStorage.removeItem("authToken")
// //     setUser(null)
// //   }

// //   const refreshUser = async () => {
// //     try {
// //       const userData = await authApi.getProfile()
// //       setUser(userData)
// //     } catch (error) {
// //       console.error("[v0] Failed to refresh user:", error)
// //     }
// //   }

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         user,
// //         isLoading,
// //         isAuthenticated: !!user,
// //         login,
// //         loginWithGoogle,
// //         loginWithGoogleToken,
// //         logout,
// //         register,
// //         refreshUser,
// //         setToken,
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   )
// // }

// // export function useAuth() {
// //   const context = useContext(AuthContext)
// //   if (context === undefined) {
// //     throw new Error("useAuth must be used within an AuthProvider")
// //   }
// //   return context
// // }
// // auth-context.js
// import { createContext, useContext, useState, useEffect } from "react"
// import { authApi, userApi } from "./api"  // Import both authApi and userApi

// const AuthContext = createContext(undefined)

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const loadUser = async () => {
//       const token = localStorage.getItem("authToken")
//       if (token) {
//         try {
//           // Use userApi.getProfile instead of authApi.getProfile
//           const userData = await userApi.getProfile()
//           setUser(userData)
//         } catch (error) {
//           console.error("[v0] Failed to load user:", error)
//           localStorage.removeItem("authToken")
//         }
//       }
//       setIsLoading(false)
//     }

//     loadUser()
//   }, [])

//   const login = async (email, password) => {
//     try {
//       const response = await authApi.login(email, password)
//       console.log("[v0] Login response:", response)

//       if (response.token) {
//         localStorage.setItem("authToken", response.token)
//         // Use userApi.getProfile instead of authApi.getProfile
//         const userData = await userApi.getProfile()
//         setUser(userData)
//         return response
//       } else {
//         throw new Error('No token received from login')
//       }
//     } catch (error) {
//       console.error("[v0] Login error:", error)
//       throw error
//     }
//   }

//   const setToken = async (token) => {
//     try {
//       console.log("[v0] Setting OAuth token")
//       localStorage.setItem("authToken", token)
//       // Use userApi.getProfile instead of authApi.getProfile
//       const userData = await userApi.getProfile()
//       setUser(userData)
//       console.log("[v0] OAuth login successful, user:", userData)
//     } catch (error) {
//       console.error("[v0] Failed to fetch user profile after OAuth:", error)
//       localStorage.removeItem("authToken")
//       throw error
//     }
//   }

//   const register = async (data) => {
//     console.log("[v0] Registration data being sent:", {
//       ...data,
//       password: "***",
//       confirmPassword: "***",
//     })

//     const response = await authApi.register(data)
//     console.log("[v0] Register response:", response)

//     if (response.token) {
//       localStorage.setItem("authToken", response.token)
//       // Use userApi.getProfile instead of authApi.getProfile
//       const userData = await userApi.getProfile()
//       setUser(userData)
//     } else if (response.data?.token) {
//       localStorage.setItem("authToken", response.data.token)
//       // Use userApi.getProfile instead of authApi.getProfile
//       const userData = await userApi.getProfile()
//       setUser(userData)
//     }
//   }

//   const logout = () => {
//     localStorage.removeItem("authToken")
//     setUser(null)
//   }

//   const refreshUser = async () => {
//     try {
//       // Use userApi.getProfile instead of authApi.getProfile
//       const userData = await userApi.getProfile()
//       setUser(userData)
//     } catch (error) {
//       console.error("[v0] Failed to refresh user:", error)
//     }
//   }

//   const loginWithGoogle = () => {
//     // Redirect to Google OAuth
//     window.location.href = authApi.getGoogleSignInUrl()
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading,
//         isAuthenticated: !!user,
//         login,
//         loginWithGoogle,
//         logout,
//         register,
//         refreshUser,
//         setToken,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
// auth-context.js
// import React, { createContext, useContext, useState, useEffect } from "react"
// import { authApi, dashboardApi } from "./api"

// const AuthContext = createContext()

// export function useAuth() {
//   return useContext(AuthContext)
// }

// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [isAdmin, setIsAdmin] = useState(false)

//   useEffect(() => {
//     // Check if user is logged in on mount
//     const token = localStorage.getItem("authToken")
//     const adminToken = localStorage.getItem("adminToken")
    
//     if (token) {
//       setIsAuthenticated(true)
//       // Check if it's an admin user
//       if (adminToken) {
//         setIsAdmin(true)
//       }
//     }
//     setLoading(false)
//   }, [])

//   // Register function - IMPORTANT: This was missing
//   const register = async (userData) => {
//     try {
//       const response = await authApi.register(userData)
//       console.log("[Auth] Registration response:", response)
      
//       if (response.token) {
//         localStorage.setItem("authToken", response.token)
//         setIsAuthenticated(true)
//         setUser(response.user || { email: userData.email })
//         return response
//       }
//       return response
//     } catch (error) {
//       console.error("[Auth] Registration error:", error)
//       throw error
//     }
//   }

//   const login = async (email, password) => {
//     try {
//       const response = await authApi.login(email, password)
//       console.log("[Auth] Login response:", response)
      
//       if (response.token) {
//         localStorage.setItem("authToken", response.token)
//         setIsAuthenticated(true)
//         setUser(response.user || { email })
        
//         // Check if this is an admin user by trying to access admin profile
//         try {
//           // Store token temporarily for admin check
//           localStorage.setItem("adminToken", response.token)
//           const adminProfile = await dashboardApi.getProfile()
          
//           if (adminProfile) {
//             // This is an admin user
//             setIsAdmin(true)
//             console.log("[Auth] Admin user detected")
//             return { ...response, isAdmin: true }
//           }
//         } catch (adminError) {
//           // Not an admin, remove admin token
//           localStorage.removeItem("adminToken")
//           setIsAdmin(false)
//           console.log("[Auth] Regular user detected")
//         }
        
//         return response
//       } else {
//         throw new Error("No token received")
//       }
//     } catch (error) {
//       console.error("[Auth] Login error:", error)
//       throw error
//     }
//   }

//   const setToken = (token) => {
//     localStorage.setItem("authToken", token)
//     setIsAuthenticated(true)
    
//     // Check if token belongs to admin
//     const checkAdminStatus = async () => {
//       try {
//         localStorage.setItem("adminToken", token)
//         const adminProfile = await dashboardApi.getProfile()
//         if (adminProfile) {
//           setIsAdmin(true)
//         }
//       } catch (error) {
//         localStorage.removeItem("adminToken")
//         setIsAdmin(false)
//       }
//     }
//     checkAdminStatus()
//   }

//   const logout = () => {
//     localStorage.removeItem("authToken")
//     localStorage.removeItem("adminToken")
//     localStorage.removeItem("adminData")
//     setIsAuthenticated(false)
//     setIsAdmin(false)
//     setUser(null)
//   }

//   const value = {
//     isAuthenticated,
//     user,
//     loading,
//     isAdmin,
//     register,  // ADDED: This was missing
//     login,
//     logout,
//     setToken,
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }
// auth-context.js - Updated
import React, { createContext, useContext, useState, useEffect } from "react"
import { authApi, dashboardApi } from "./api"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken")
      const storedIsAdmin = localStorage.getItem("isAdmin") === "true"
      const storedEmail = localStorage.getItem("userEmail")
      
      if (token) {
        setIsAuthenticated(true)
        
        // Check if admin based on stored flag or email
        if (storedIsAdmin || storedEmail === "admin@gmail.com") {
          setIsAdmin(true)
          console.log("[Auth] Admin user detected from localStorage")
        } else {
          // Try to verify if this token belongs to admin
          try {
            // Store token temporarily for admin check
            localStorage.setItem("adminToken", token)
            const adminProfile = await dashboardApi.getProfile()
            if (adminProfile) {
              setIsAdmin(true)
              localStorage.setItem("isAdmin", "true")
              console.log("[Auth] Admin user detected from API")
            }
          } catch (error) {
            setIsAdmin(false)
            console.log("[Auth] Regular user detected")
          }
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData)
      console.log("[Auth] Registration response:", response)
      
      if (response.token) {
        localStorage.setItem("authToken", response.token)
        localStorage.setItem("userEmail", userData.email)
        localStorage.setItem("isAdmin", "false")
        setIsAuthenticated(true)
        setIsAdmin(false)
        setUser(response.user || { email: userData.email })
        return response
      }
      return response
    } catch (error) {
      console.error("[Auth] Registration error:", error)
      throw error
    }
  }

  const login = async (email, password) => {
    try {
      // Check for admin credentials first
      if (email === "admin@gmail.com" && password === "P@ssword123") {
        console.log("[Auth] Admin login detected")
        
        // Create a simple token for admin
        const adminToken = btoa(JSON.stringify({ 
          email, 
          role: "Admin",
          timestamp: Date.now()
        }))
        
        localStorage.setItem("authToken", adminToken)
        localStorage.setItem("adminToken", adminToken)
        localStorage.setItem("isAdmin", "true")
        localStorage.setItem("userEmail", email)
        
        setIsAuthenticated(true)
        setIsAdmin(true)
        setUser({ email, name: "Admin User", role: "Admin" })
        
        return { token: adminToken, isAdmin: true }
      }
      
      // Regular user login
      const response = await authApi.login(email, password)
      console.log("[Auth] Regular login response:", response)
      
      if (response.token) {
        localStorage.setItem("authToken", response.token)
        localStorage.setItem("userEmail", email)
        localStorage.setItem("isAdmin", "false")
        setIsAuthenticated(true)
        setIsAdmin(false)
        setUser(response.user || { email })
        
        return { ...response, isAdmin: false }
      } else {
        throw new Error("No token received")
      }
    } catch (error) {
      console.error("[Auth] Login error:", error)
      throw error
    }
  }

  const setToken = (token) => {
    localStorage.setItem("authToken", token)
    localStorage.setItem("isAdmin", "false")
    setIsAuthenticated(true)
    setIsAdmin(false)
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminData")
    localStorage.removeItem("isAdmin")
    localStorage.removeItem("userEmail")
    setIsAuthenticated(false)
    setIsAdmin(false)
    setUser(null)
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    isAdmin,
    register,
    login,
    logout,
    setToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}