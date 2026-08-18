# API Integration Guide

This document outlines all the backend API integrations that have been implemented in the HealthPal Doctor Appointment web application.

## Base URL
\`\`\`
https://clinic13.runasp.net
\`\`\`

## Environment Variables
Add these to your `.env.local` file:
\`\`\`env
NEXT_PUBLIC_API_BASE_URL=https://clinic13.runasp.net
NEXT_PUBLIC_GOOGLE_CLIENT_ID=tt83729864@gmail.com
\`\`\`

## API Routes (Proxy Layer)

All API calls go through Next.js API routes to handle CORS issues. The routes are located in the `/app/api` directory.

### Authentication APIs

#### 1. Register User
- **Route:** `POST /api/auth/register`
- **Backend:** `POST /api/User/Register`
- **Data:** FormData with Name, Nickname, Email, UserName, Password, ConfirmPassword, Phone, DateOfBirth, Gender, Photo
- **Response:** `{ userName: string, token: string }`

#### 2. Login
- **Route:** `POST /api/auth/login`
- **Backend:** `POST /api/User/login`
- **Data:** `{ email: string, password: string }`
- **Response:** `{ userName: string, token: string }`

#### 3. Forgot Password
- **Route:** `POST /api/auth/forgot-password`
- **Backend:** `POST /api/User/forgot-password`
- **Data:** `{ email: string }`
- **Response:** Success message (OTP sent to email)

#### 4. Verify OTP
- **Route:** `POST /api/auth/verify-otp`
- **Backend:** `POST /api/User/verify-otp`
- **Data:** `{ email: string, code: string }`
- **Response:** Verification success

#### 5. Reset Password
- **Route:** `POST /api/auth/reset-password`
- **Backend:** `POST /api/User/reset-password`
- **Data:** `{ email: string, code: string, newPassword: string, confirmPassword: string }`
- **Response:** Success message

#### 6. Get User Profile
- **Route:** `GET /api/auth/profile`
- **Backend:** `GET /api/User/profile`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** User profile data

#### 7. Google OAuth
- **Route:** `GET /api/oauth/signin-google`
- **Backend:** `GET /api/OAuth/signin-google`
- **Response:** Google OAuth redirect URL

### Doctor APIs

#### 1. Get All Doctors
- **Route:** `GET /api/doctors`
- **Backend:** `GET /api/Doctor`
- **Response:** Array of doctor objects

#### 2. Search Doctors by Name
- **Route:** `GET /api/doctors/search?name={name}`
- **Backend:** `GET /api/Doctor/by-name?name={name}`
- **Response:** Array of matching doctors

#### 3. Get Doctors by Category
- **Route:** `GET /api/doctors/by-category/{categoryId}`
- **Backend:** `GET /api/Doctor/by-category/{categoryId}`
- **Response:** Array of doctors in category

### Favourite APIs

#### 1. Add Favourite
- **Route:** `POST /api/favourite`
- **Backend:** `POST /api/Favourite`
- **Data:** `{ doctorId: string }`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** Success message

#### 2. Get User Favourites
- **Route:** `GET /api/favourite/user`
- **Backend:** `GET /api/Favourite/user`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** Array of favourite doctors

#### 3. Remove Favourite
- **Route:** `DELETE /api/favourite/{id}`
- **Backend:** `DELETE /api/Favourite/{id}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** Success message

### Notification APIs

#### 1. Get Notifications
- **Route:** `GET /api/notification`
- **Backend:** `GET /api/Notification`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** Array of notifications

#### 2. Create Notification
- **Route:** `POST /api/notification`
- **Backend:** `POST /api/Notification`
- **Data:** `{ userId?: string, title?: string, message?: string, isRead?: boolean }`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** Success message

## Usage Examples

### Registration
\`\`\`typescript
import { authApi } from '@/lib/api'

const handleRegister = async () => {
  try {
    const response = await authApi.register({
      name: "John Doe",
      nickname: "Johnny",
      email: "john@example.com",
      userName: "johndoe",
      password: "Password123!",
      confirmPassword: "Password123!",
      phone: "1234567890",
      dateOfBirth: "1990-01-01",
      gender: 1, // 1=Male, 2=Female, 3=Other
      photo: fileObject
    })
    // Store token: localStorage.setItem('authToken', response.token)
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
\`\`\`

### Login
\`\`\`typescript
import { authApi } from '@/lib/api'

const handleLogin = async () => {
  try {
    const response = await authApi.login("email@example.com", "password")
    localStorage.setItem('authToken', response.token)
  } catch (error) {
    console.error('Login failed:', error)
  }
}
\`\`\`

### Search Doctors
\`\`\`typescript
import { doctorApi } from '@/lib/api'

const searchDoctors = async (name: string) => {
  try {
    const doctors = await doctorApi.searchByName(name)
    console.log('Found doctors:', doctors)
  } catch (error) {
    console.error('Search failed:', error)
  }
}
\`\`\`

## Error Handling

All API routes handle both JSON and non-JSON responses from the backend. Errors are properly logged and returned in a consistent format:

\`\`\`typescript
{
  error: string,
  details?: string
}
\`\`\`

## Authentication Flow

1. User registers or logs in
2. Token is returned and stored in localStorage
3. Token is automatically included in all subsequent API calls via the Authorization header
4. For password reset: forgot-password → verify-otp → reset-password

## Notes

- All API calls are proxied through Next.js API routes to avoid CORS issues
- Tokens are stored in localStorage and automatically attached to requests
- Gender enum: 1 = Male, 2 = Female, 3 = Other
- DateOfBirth should be in ISO string format
- Photo upload uses multipart/form-data
