// "use client"

// import { useState, useEffect } from "react"
// import { Star, MapPin, Heart, Loader2, Trash2, ArrowLeft } from "lucide-react"
// import { Button } from "./ui/button"
// import { Card, CardContent } from "./ui/card"
// import { favouriteApi } from "../lib/api"
// import { useAuth } from "../lib/auth-context"
// import { useNavigate } from "react-router-dom"

// export default function FavouritesPage() {
//   const [favourites, setFavourites] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [removingId, setRemovingId] = useState(null)
//   const { isAuthenticated } = useAuth()
//   const navigate = useNavigate()

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/signin")
//       return
//     }
//     fetchFavourites()
//   }, [isAuthenticated, navigate])

//   const fetchFavourites = async () => {
//     setIsLoading(true)
//     setError("")
//     try {
//       const data = await favouriteApi.getUserFavourites()
//       console.log("[v0] Fetched favourites:", data)
//       // Handle different response structures
//       const favouritesList = Array.isArray(data) ? data : data?.data || []
//       setFavourites(favouritesList)
//     } catch (err) {
//       console.error("[v0] Error fetching favourites:", err)
//       setError("Failed to load favourites. Please try again.")
//       setFavourites([])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleRemoveFavourite = async (doctorId, favouriteId) => {
//     setRemovingId(doctorId)
//     try {
//       // If the API expects favourite ID, use it; otherwise use doctorId
//       const idToRemove = favouriteId || doctorId
//       await favouriteApi.removeFavourite(idToRemove)
//       console.log("[v0] Removed from favourites")
      
//       // Update local state
//       setFavourites(prev => prev.filter(fav => {
//         // Handle different data structures
//         const favId = fav.id || fav.doctorId || fav.doctor?.id
//         return favId !== doctorId
//       }))
//     } catch (err) {
//       console.error("[v0] Error removing favourite:", err)
//       alert("Failed to remove from favourites")
//     } finally {
//       setRemovingId(null)
//     }
//   }

//   const handleBackToDoctors = () => {
//     navigate("/doctors")
//   }

//   if (!isAuthenticated) {
//     return null // Will redirect in useEffect
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header with back button */}
//         <div className="flex items-center gap-4 mb-6">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={handleBackToDoctors}
//             className="hover:bg-muted"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//           <h1 className="text-3xl font-bold text-foreground">My Favourites</h1>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           </div>
//         ) : error ? (
//           <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
//             <p className="text-destructive">{error}</p>
//             <Button onClick={fetchFavourites} className="mt-4">
//               Retry
//             </Button>
//           </div>
//         ) : (
//           <>
//             <div className="flex items-center justify-between mb-6">
//               <p className="text-sm text-muted-foreground">
//                 {favourites.length} {favourites.length === 1 ? 'doctor' : 'doctors'} in your favourites
//               </p>
//             </div>

//             <div className="space-y-4">
//               {favourites.map((favourite) => {
//                 // Handle different possible data structures from API
//                 const doctor = favourite.doctor || favourite
//                 const doctorId = doctor.id || favourite.doctorId || favourite.id
//                 const favouriteId = favourite.id
                
//                 return (
//                   <Card key={doctorId} className="overflow-hidden hover:shadow-lg transition-shadow">
//                     <CardContent className="p-4">
//                       <div className="flex gap-4">
//                         <div className="flex-shrink-0">
//                           <img
//                             src={doctor.photoUrl || "/placeholder.svg?height=80&width=80"}
//                             alt={doctor.name}
//                             className="w-20 h-20 rounded-2xl object-cover"
//                             onError={(e) => {
//                               e.target.src = "/placeholder.svg?height=80&width=80"
//                             }}
//                           />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-start justify-between mb-2">
//                             <div>
//                               <h3 className="text-lg font-bold text-foreground">{doctor.name}</h3>
//                               <p className="text-sm text-muted-foreground">
//                                 {doctor.specialty || doctor.specialization || "Doctor"}
//                               </p>
//                             </div>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
//                               onClick={() => handleRemoveFavourite(doctorId, favouriteId)}
//                               disabled={removingId === doctorId}
//                             >
//                               {removingId === doctorId ? (
//                                 <Loader2 className="h-5 w-5 animate-spin" />
//                               ) : (
//                                 <Trash2 className="h-5 w-5" />
//                               )}
//                             </Button>
//                           </div>
                          
//                           {doctor.location && (
//                             <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
//                               <MapPin className="h-4 w-4" />
//                               {doctor.location}
//                             </div>
//                           )}
                          
//                           {doctor.rating && (
//                             <div className="flex items-center gap-1">
//                               <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
//                               <span className="font-medium text-foreground">{doctor.rating}</span>
//                               {doctor.reviews && (
//                                 <span className="text-sm text-muted-foreground">
//                                   ({doctor.reviews} Reviews)
//                                 </span>
//                               )}
//                             </div>
//                           )}

//                           {/* Optional: Add book appointment button */}
//                           <div className="mt-3">
//                             <Button 
//                               variant="outline" 
//                               size="sm"
//                               onClick={() => navigate(`/doctors/${doctorId}/book`)}
//                               className="text-sm"
//                             >
//                               Book Appointment
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })}

//               {favourites.length === 0 && (
//                 <div className="text-center py-12">
//                   <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//                   <p className="text-muted-foreground text-lg mb-2">No favourites yet</p>
//                   <p className="text-sm text-muted-foreground mb-4">
//                     Start adding doctors to your favourites by clicking the heart icon on the doctors page
//                   </p>
//                   <Button onClick={handleBackToDoctors}>
//                     Browse Doctors
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }
// FavouritesPage.jsx
"use client"

import { useState, useEffect } from "react"
import { Star, MapPin, Heart, Loader2, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { favouriteApi } from "../lib/api"
import { useAuth } from "../lib/auth-context"
import { useNavigate } from "react-router-dom"

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [removingId, setRemovingId] = useState(null)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin")
      return
    }
    fetchFavourites()
  }, [isAuthenticated, navigate])

  const fetchFavourites = async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await favouriteApi.getUserFavourites()
      console.log("[FavouritesPage] Fetched favourites:", data)
      
      // Handle different response structures
      let favouritesList = []
      if (Array.isArray(data)) {
        favouritesList = data
      } else if (data?.data && Array.isArray(data.data)) {
        favouritesList = data.data
      } else if (data?.$values && Array.isArray(data.$values)) {
        favouritesList = data.$values
      }
      
      setFavourites(favouritesList)
    } catch (err) {
      console.error("[FavouritesPage] Error fetching favourites:", err)
      setError("Failed to load favourites. Please try again.")
      setFavourites([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFavourite = async (favouriteId, doctorId) => {
    if (!favouriteId) {
      console.error("[FavouritesPage] No favourite ID provided for removal")
      alert("Cannot remove favourite: missing identifier")
      return
    }

    setRemovingId(doctorId)
    try {
      console.log("[FavouritesPage] Removing favourite with ID:", favouriteId)
      await favouriteApi.removeFavourite(favouriteId)
      console.log("[FavouritesPage] Successfully removed from favourites")
      
      // Update local state
      setFavourites(prev => prev.filter(fav => {
        const favId = fav.id || fav.favouriteId
        return favId !== favouriteId
      }))
      
    } catch (err) {
      console.error("[FavouritesPage] Error removing favourite:", err)
      alert("Failed to remove from favourites. Please try again.")
    } finally {
      setRemovingId(null)
    }
  }

  const handleBackToDoctors = () => {
    navigate("/doctors")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToDoctors}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">My Favourites</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchFavourites} className="mt-4">
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {favourites.length} {favourites.length === 1 ? 'doctor' : 'doctors'} in your favourites
              </p>
            </div>

            <div className="space-y-4">
              {favourites.map((favourite) => {
                // Extract doctor information
                const doctor = favourite.doctor || favourite
                const doctorId = doctor.id || favourite.doctorId
                const favouriteId = favourite.id || favourite.favouriteId
                const doctorName = doctor.name || favourite.doctorName
                const doctorSpecialty = doctor.specialty || doctor.specialization || favourite.specialty
                const doctorLocation = doctor.location || favourite.location
                const doctorRating = doctor.rating || favourite.rating
                const doctorReviews = doctor.reviews || favourite.reviews
                const doctorPhotoUrl = doctor.photoUrl || favourite.photoUrl
                
                console.log("[FavouritesPage] Rendering favourite:", { 
                  doctorId, 
                  favouriteId, 
                  doctorName 
                })
                
                return (
                  <Card key={favouriteId || doctorId} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={doctorPhotoUrl || "/placeholder.svg?height=80&width=80"}
                            alt={doctorName}
                            className="w-20 h-20 rounded-2xl object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=80&width=80"
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-foreground">{doctorName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {doctorSpecialty || "Doctor"}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex-shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleRemoveFavourite(favouriteId, doctorId)}
                              disabled={removingId === doctorId}
                            >
                              {removingId === doctorId ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <Trash2 className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                          
                          {doctorLocation && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                              <MapPin className="h-4 w-4" />
                              {doctorLocation}
                            </div>
                          )}
                          
                          {doctorRating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="font-medium text-foreground">{doctorRating}</span>
                              {doctorReviews && (
                                <span className="text-sm text-muted-foreground">
                                  ({doctorReviews} Reviews)
                                </span>
                              )}
                            </div>
                          )}

                          <div className="mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/doctors/${doctorId}/book`)}
                              className="text-sm"
                            >
                              Book Appointment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {favourites.length === 0 && (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-2">No favourites yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start adding doctors to your favourites by clicking the heart icon on the doctors page
                  </p>
                  <Button onClick={handleBackToDoctors}>
                    Browse Doctors
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}