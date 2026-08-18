// "use client"

// import { useState } from "react"
// import { Menu, X, User, LogOut } from "lucide-react"
// import { useNavigate } from "react-router-dom"
// import { Button } from "./ui/button"
// import { useAuth } from "../lib/auth-context"

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false)
//   const navigate = useNavigate()
//   const { isAuthenticated, user, logout } = useAuth()

//   const handleLogout = () => {
//     logout()
//     setIsOpen(false)
//     navigate("/")
//   }

//   const handleNavigation = (path) => {
//     navigate(path)
//     setIsOpen(false)
//   }

//   return (
//     <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center">
//             <button onClick={() => handleNavigation("/")} className="flex items-center gap-2">
//               <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <rect width="40" height="40" rx="8" fill="currentColor" className="text-primary" />
//                 <path d="M20 10v20M10 20h20M16 16h8v8h-8z" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
//               </svg>
//               <span className="text-xl font-bold text-foreground">
//                 Health<span className="text-primary">Pal</span>
//               </span>
//             </button>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex md:items-center md:gap-8">
//             <button
//               onClick={() => handleNavigation("/")}
//               className="text-foreground hover:text-primary transition-colors"
//             >
//               Home
//             </button>
//             <button
//               onClick={() => handleNavigation("/doctors")}
//               className="text-foreground hover:text-primary transition-colors"
//             >
//               Find Doctors
//             </button>
//             <button
//               onClick={() => handleNavigation("/bookings")}
//               className="text-foreground hover:text-primary transition-colors"
//             >
//               My Bookings
//             </button>
//              <button
//               onClick={() => handleNavigation("/favourites")}
//               className="text-foreground hover:text-primary transition-colors"
//             >
//               Favorites
//             </button>
//           </div>

//           {/* Desktop Auth Buttons */}
//           <div className="hidden md:flex md:items-center md:gap-3">
//             {isAuthenticated ? (
//               <>
//                 <span className="text-sm text-muted-foreground">Hi, {user?.name || user?.userName}</span>
//                 <Button variant="outline" size="icon" onClick={() => handleNavigation("/profile")}>
//                   <User className="h-5 w-5" />
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
//                   <LogOut className="h-5 w-5" />
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Button variant="ghost" onClick={() => handleNavigation("/signin")}>
//                   Sign In
//                 </Button>
//                 <Button onClick={() => handleNavigation("/signup")}>Sign Up</Button>
//               </>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
//               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       {isOpen && (
//         <div className="md:hidden border-t border-border">
//           <div className="px-4 pt-2 pb-3 space-y-1">
//             <button
//               onClick={() => handleNavigation("/")}
//               className="block w-full text-left px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
//             >
//               Home
//             </button>
//             <button
//               onClick={() => handleNavigation("/doctors")}
//               className="block w-full text-left px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
//             >
//               Find Doctors
//             </button>
//             <button
//               onClick={() => handleNavigation("/bookings")}
//               className="block w-full text-left px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
//             >
//               My Bookings
//             </button>
//             <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
//               {isAuthenticated ? (
//                 <>
//                   <p className="text-sm text-muted-foreground px-3 py-2">Hi, {user?.name || user?.userName}</p>
//                   <Button
//                     variant="outline"
//                     onClick={() => handleNavigation("/profile")}
//                     className="w-full bg-transparent"
//                   >
//                     Profile
//                   </Button>
//                   <Button variant="destructive" onClick={handleLogout} className="w-full">
//                     Logout
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Button
//                     variant="outline"
//                     onClick={() => handleNavigation("/signin")}
//                     className="w-full bg-transparent"
//                   >
//                     Sign In
//                   </Button>
//                   <Button onClick={() => handleNavigation("/signup")} className="w-full">
//                     Sign Up
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   )
// }
"use client"

import { useState } from "react"
import { Menu, X, User, LogOut, UserCircle, Settings, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { useAuth } from "../lib/auth-context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    setIsProfileMenuOpen(false)
    navigate("/")
  }

  const handleNavigation = (path) => {
    navigate(path)
    setIsOpen(false)
    setIsProfileMenuOpen(false)
  }

  // Get user's display name or fallback
  const displayName = user?.name || user?.userName || user?.email?.split('@')[0] || "User"
  
  // Get first letter for avatar
  const firstLetter = displayName.charAt(0).toUpperCase()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => handleNavigation("/")} className="flex items-center gap-2">
              <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="currentColor" className="text-primary" />
                <path d="M20 10v20M10 20h20M16 16h8v8h-8z" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="text-xl font-bold text-foreground">
                Health<span className="text-primary">Pal</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <button
              onClick={() => handleNavigation("/")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("/doctors")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Find Doctors
            </button>
            <button
              onClick={() => handleNavigation("/bookings")}
              className="text-foreground hover:text-primary transition-colors"
            >
              My Bookings
            </button>
            <button
              onClick={() => handleNavigation("/favourites")}
              className="text-foreground hover:text-primary transition-colors"
            >
              Favorites
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-muted/50 transition-all duration-200 group"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                      {user?.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={displayName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-semibold">
                          {firstLetter}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {displayName}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </Button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-background rounded-lg shadow-lg border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-3 border-b border-border bg-muted/30">
                        <p className="text-sm font-semibold text-foreground">{displayName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => handleNavigation("/profile")}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <UserCircle className="h-4 w-4" />
                          My Profile
                        </button>
                        {/* <button
                          onClick={() => handleNavigation("/profile/settings")}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </button> */}
                        <div className="border-t border-border my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={() => handleNavigation("/signin")}>
                  Sign In
                </Button>
                <Button onClick={() => handleNavigation("/signup")}>Sign Up</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleNavigation("/")}
              className="block w-full text-left px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("/doctors")}
              className="block w-full text-left px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
            >
              Find Doctors
            </button>
            <button
              onClick={() => handleNavigation("/bookings")}
              className="block w-full text-left px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
            >
              My Bookings
            </button>
            <button
              onClick={() => handleNavigation("/favourites")}
              className="block w-full text-left px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
            >
              Favorites
            </button>
            
            <div className="flex flex-col gap-2 pt-4 border-t border-border mt-2">
              {isAuthenticated ? (
                <>
                  {/* Mobile Profile Section */}
                  <div className="flex items-center gap-3 px-3 py-2 bg-muted/30 rounded-lg mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center shadow-md">
                      {user?.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={displayName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-semibold">
                          {firstLetter}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleNavigation("/profile")}
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <UserCircle className="h-4 w-4" />
                    My Profile
                  </Button>
{/*                   
                  <Button
                    variant="outline"
                    onClick={() => handleNavigation("/profile/settings")}
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                   */}
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout} 
                    className="w-full justify-start gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleNavigation("/signin")}
                    className="w-full bg-transparent"
                  >
                    Sign In
                  </Button>
                  <Button onClick={() => handleNavigation("/signup")} className="w-full">
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}