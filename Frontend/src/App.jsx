import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./lib/auth-context"
import Navbar from "./components/navbar"
import HomePage from "./components/home-page"
import SignUpPage from "./components/signup-page"
import SignInPage from "./components/signin-page"
import DoctorsPage from "./components/doctors-page"
import BookingsPage from "./components/bookings-page"
import ForgotPasswordPage from "./components/forgot-password-page"
import ResetPasswordPage from "./components/reset-password-page"
import VerifyOtpPage from "./components/verify-otp-page"
import "./index.css"
import FavouritesPage from "./components/favorites"
import ProfilePage from "./components/profile.jsx"
import NotificationPage from "./components/notification"
import DoctorDetailsPage from "./components/DoctorDetailsPage.jsx"
import AdminLogin from "./components/AdminLogin.jsx"
import AdminDashboard from "./components/AdminDashboard.jsx"
import { ProtectedRoute } from "./components/ProtectedRoute.jsx"

// import AdminDashboard from "./components/AdminDashboard.jsx"
// import AdminBookings from "./components/AdminBookings.jsx"
// import AdminOverview from "./components/AdminOverview.jsx"
// import AdminProfile from "./components/AdminProfile.jsx"
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/admin/dashboard/*" 
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
          {/* <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/overvirew" element={<AdminOverview />} />
          <Route path="/admin/profile" element={<AdminProfile />} /> */}

          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favourites" element={<FavouritesPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/doctor/:id" element={<DoctorDetailsPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
