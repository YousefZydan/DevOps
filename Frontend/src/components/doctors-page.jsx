
// import { useState, useEffect } from "react"
// import { Search, Star, MapPin, Heart, Loader2 } from "lucide-react"
// import { Input } from "./ui/input"
// import { Button } from "./ui/button"
// import { Card, CardContent } from "./ui/card"
// import { doctorApi, favouriteApi } from "../lib/api"
// import { useAuth } from "../lib/auth-context"

// const specialties = ["All", "General", "Cardiologist", "Dentist", "Neurologist", "Orthopedic"]

// export default function DoctorsPage() {
//   const [selectedSpecialty, setSelectedSpecialty] = useState("All")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [doctors, setDoctors] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState("")
//   const { isAuthenticated } = useAuth()

//   useEffect(() => {
//     fetchDoctors()
//   }, [])

//   useEffect(() => {
//     const delaySearch = setTimeout(() => {
//       if (searchQuery) {
//         searchDoctors()
//       } else {
//         fetchDoctors()
//       }
//     }, 500)

//     return () => clearTimeout(delaySearch)
//   }, [searchQuery])

//   const fetchDoctors = async () => {
//     setIsLoading(true)
//     setError("")
//     try {
//       const data = await doctorApi.getAllDoctors()
//       console.log("[v0] Fetched doctors:", data)
//       setDoctors(Array.isArray(data) ? data : [])
//     } catch (err) {
//       console.error("[v0] Error fetching doctors:", err)
//       setError("Failed to load doctors. Please try again.")
//       setDoctors([])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const searchDoctors = async () => {
//     setIsLoading(true)
//     setError("")
//     try {
//       const data = await doctorApi.searchByName(searchQuery)
//       console.log("[v0] Search results:", data)
//       setDoctors(Array.isArray(data) ? data : [])
//     } catch (err) {
//       console.error("[v0] Error searching doctors:", err)
//       setError("Failed to search doctors. Please try again.")
//       setDoctors([])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // const handleFavouriteToggle = async (doctorId) => {
//   //   if (!isAuthenticated) {
//   //     alert("Please sign in to add favourites")
//   //     return
//   //   }

//   //   try {
//   //     await favouriteApi.addFavourite(doctorId)
//   //     console.log("[v0] Added to favourites")
//   //   } catch (err) {
//   //     console.error("[v0] Error adding favourite:", err)
//   //     alert("Failed to add to favourites")
//   //   }
//   // }
// const handleFavouriteToggle = async (doctorId) => {
//   if (!isAuthenticated) {
//     alert("Please sign in to add favourites")
//     return
//   }

//   try {
//     await favouriteApi.addFavourite(doctorId)
//     console.log("[v0] Added to favourites")
//     // Optional: Show success message or navigate
//     navigate("/favourites")
//   } catch (err) {
//     console.error("[v0] Error adding favourite:", err)
//     alert("Failed to add to favourites")
//   }
// }
//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-3xl font-bold text-foreground mb-6">All Doctors</h1>

//         <div className="relative mb-6">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//           <Input
//             type="text"
//             placeholder="Search doctor..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 h-12 bg-muted/50"
//           />
//         </div>

//         <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
//           {specialties.map((specialty) => (
//             <Button
//               key={specialty}
//               variant={selectedSpecialty === specialty ? "default" : "outline"}
//               onClick={() => setSelectedSpecialty(specialty)}
//               className="whitespace-nowrap"
//             >
//               {specialty}
//             </Button>
//           ))}
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           </div>
//         ) : error ? (
//           <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
//             <p className="text-destructive">{error}</p>
//             <Button onClick={fetchDoctors} className="mt-4">
//               Retry
//             </Button>
//           </div>
//         ) : (
//           <>
//             <div className="flex items-center justify-between mb-6">
//               <p className="text-sm text-muted-foreground">{doctors.length} founds</p>
//               <Button variant="ghost" size="sm">
//                 Default ↕
//               </Button>
//             </div>

//             <div className="space-y-4">
//               {doctors.map((doctor) => (
//                 <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
//                   <CardContent className="p-4">
//                     <div className="flex gap-4">
//                       <div className="flex-shrink-0">
//                         <img
//                           src={doctor.photoUrl || "/placeholder.svg?height=80&width=80"}
//                           alt={doctor.name}
//                           className="w-20 h-20 rounded-2xl object-cover"
//                         />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-start justify-between mb-2">
//                           <div>
//                             <h3 className="text-lg font-bold text-foreground">{doctor.name}</h3>
//                             <p className="text-sm text-muted-foreground">{doctor.specialty || doctor.specialization}</p>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="flex-shrink-0"
//                             onClick={() => handleFavouriteToggle(doctor.id)}
//                           >
//                             <Heart className="h-5 w-5" />
//                           </Button>
//                         </div>
//                         {doctor.location && (
//                           <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
//                             <MapPin className="h-4 w-4" />
//                             {doctor.location}
//                           </div>
//                         )}
//                         {doctor.rating && (
//                           <div className="flex items-center gap-1">
//                             <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
//                             <span className="font-medium text-foreground">{doctor.rating}</span>
//                             {doctor.reviews && (
//                               <span className="text-sm text-muted-foreground">{doctor.reviews} Reviews</span>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}

//               {doctors.length === 0 && (
//                 <div className="text-center py-12">
//                   <p className="text-muted-foreground">No doctors found</p>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }
// DoctorsPage.jsx
// import { useState, useEffect } from "react"
// import { Search, Star, MapPin, Heart, Loader2 } from "lucide-react"
// import { Input } from "./ui/input"
// import { Button } from "./ui/button"
// import { Card, CardContent } from "./ui/card"
// import { doctorApi, favouriteApi } from "../lib/api"
// import { useAuth } from "../lib/auth-context"
// import { useNavigate } from "react-router-dom"

// const specialties = ["All", "General", "Cardiologist", "Dentist", "Neurologist", "Orthopedic"]

// export default function DoctorsPage() {
//   const [selectedSpecialty, setSelectedSpecialty] = useState("All")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [doctors, setDoctors] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [favouritesMap, setFavouritesMap] = useState(new Map()) // Map<doctorId, favouriteId>
//   const [togglingId, setTogglingId] = useState(null)
//   const { isAuthenticated } = useAuth()
//   const navigate = useNavigate()

//   useEffect(() => {
//     loadData()
//   }, [])

//   useEffect(() => {
//     const delaySearch = setTimeout(() => {
//       if (searchQuery) {
//         searchDoctors()
//       } else {
//         loadDoctors()
//       }
//     }, 500)

//     return () => clearTimeout(delaySearch)
//   }, [searchQuery])

//   const loadData = async () => {
//     await loadDoctors()
//     if (isAuthenticated) {
//       await loadFavourites()
//     }
//   }

//   const loadDoctors = async () => {
//     setIsLoading(true)
//     setError("")
//     try {
//       const data = await doctorApi.getAllDoctors()
//       console.log("[DoctorsPage] Fetched doctors:", data)
//       setDoctors(Array.isArray(data) ? data : [])
//     } catch (err) {
//       console.error("[DoctorsPage] Error fetching doctors:", err)
//       setError("Failed to load doctors. Please try again.")
//       setDoctors([])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const loadFavourites = async () => {
//     try {
//       const data = await favouriteApi.getUserFavourites()
//       console.log("[DoctorsPage] Fetched favourites:", data)
      
//       // Create a map of doctorId -> favouriteId
//       const map = new Map()
//       const favouritesList = Array.isArray(data) ? data : data?.data || []
      
//       favouritesList.forEach(fav => {
//         // Handle different possible response structures
//         const doctorId = fav.doctorId || fav.doctor?.id
//         const favouriteId = fav.id || fav.favouriteId
        
//         if (doctorId && favouriteId) {
//           map.set(doctorId, favouriteId)
//         }
//       })
      
//       setFavouritesMap(map)
//     } catch (err) {
//       console.error("[DoctorsPage] Error fetching favourites:", err)
//       // Don't show error for favourites fetching failure
//     }
//   }

//   const searchDoctors = async () => {
//     setIsLoading(true)
//     setError("")
//     try {
//       const data = await doctorApi.searchByName(searchQuery)
//       console.log("[DoctorsPage] Search results:", data)
//       setDoctors(Array.isArray(data) ? data : [])
//     } catch (err) {
//       console.error("[DoctorsPage] Error searching doctors:", err)
//       setError("Failed to search doctors. Please try again.")
//       setDoctors([])
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleFavouriteToggle = async (doctorId) => {
//     if (!isAuthenticated) {
//       alert("Please sign in to add favourites")
//       navigate("/signin")
//       return
//     }

//     setTogglingId(doctorId)
//     try {
//       const isFavourite = favouritesMap.has(doctorId)
      
//       if (isFavourite) {
//         // Remove from favourites
//         const favouriteId = favouritesMap.get(doctorId)
//         console.log("[DoctorsPage] Removing favourite with ID:", favouriteId)
//         await favouriteApi.removeFavourite(favouriteId)
        
//         // Update local state
//         setFavouritesMap(prev => {
//           const newMap = new Map(prev)
//           newMap.delete(doctorId)
//           return newMap
//         })
//         console.log("[DoctorsPage] Successfully removed from favourites")
//       } else {
//         // Add to favourites
//         console.log("[DoctorsPage] Adding favourite for doctor:", doctorId)
//         const response = await favouriteApi.addFavourite(doctorId)
//         console.log("[DoctorsPage] Add favourite response:", response)
        
//         // Extract the favourite ID from response
//         const favouriteId = response?.id || response?.favouriteId || doctorId
        
//         // Update local state
//         setFavouritesMap(prev => {
//           const newMap = new Map(prev)
//           newMap.set(doctorId, favouriteId)
//           return newMap
//         })
//         console.log("[DoctorsPage] Successfully added to favourites")
//       }
//     } catch (err) {
//       console.error("[DoctorsPage] Error toggling favourite:", err)
//       alert(`Failed to ${favouritesMap.has(doctorId) ? "remove from" : "add to"} favourites. Please try again.`)
//     } finally {
//       setTogglingId(null)
//     }
//   }

//   const getFilteredDoctors = () => {
//     if (selectedSpecialty === "All") {
//       return doctors
//     }
//     return doctors.filter(doctor => 
//       doctor.specialty === selectedSpecialty || doctor.specialization === selectedSpecialty
//     )
//   }

//   const filteredDoctors = getFilteredDoctors()

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-3xl font-bold text-foreground mb-6">All Doctors</h1>

//         <div className="relative mb-6">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//           <Input
//             type="text"
//             placeholder="Search doctor..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 h-12 bg-muted/50"
//           />
//         </div>

//         <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
//           {specialties.map((specialty) => (
//             <Button
//               key={specialty}
//               variant={selectedSpecialty === specialty ? "default" : "outline"}
//               onClick={() => setSelectedSpecialty(specialty)}
//               className="whitespace-nowrap"
//             >
//               {specialty}
//             </Button>
//           ))}
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           </div>
//         ) : error ? (
//           <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
//             <p className="text-destructive">{error}</p>
//             <Button onClick={loadDoctors} className="mt-4">
//               Retry
//             </Button>
//           </div>
//         ) : (
//           <>
//             <div className="flex items-center justify-between mb-6">
//               <p className="text-sm text-muted-foreground">{filteredDoctors.length} found</p>
//               <Button variant="ghost" size="sm">
//                 Default ↕
//               </Button>
//             </div>

//             <div className="space-y-4">
//               {filteredDoctors.map((doctor) => {
//                 const isFavourite = favouritesMap.has(doctor.id)
                
//                 return (
//                   <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
//                                 {doctor.specialty || doctor.specialization}
//                               </p>
//                             </div>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className={`flex-shrink-0 transition-colors ${
//                                 isFavourite 
//                                   ? "text-red-500 hover:text-red-600 hover:bg-red-50" 
//                                   : "text-muted-foreground hover:text-red-500"
//                               }`}
//                               onClick={() => handleFavouriteToggle(doctor.id)}
//                               disabled={togglingId === doctor.id}
//                             >
//                               {togglingId === doctor.id ? (
//                                 <Loader2 className="h-5 w-5 animate-spin" />
//                               ) : (
//                                 <Heart 
//                                   className={`h-5 w-5 ${isFavourite ? "fill-current" : ""}`} 
//                                 />
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
//                                 <span className="text-sm text-muted-foreground">{doctor.reviews} Reviews</span>
//                               )}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })}

//               {filteredDoctors.length === 0 && (
//                 <div className="text-center py-12">
//                   <p className="text-muted-foreground">No doctors found</p>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }
// DoctorsPage.jsx
import { useState, useEffect } from "react"
import { Search, Star, MapPin, Heart, Loader2 } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { doctorApi, favouriteApi } from "../lib/api"
import { useAuth } from "../lib/auth-context"
import { useNavigate } from "react-router-dom"

const specialties = ["All", "General", "Cardiologist", "Dentist", "Neurologist", "Orthopedic"]

export default function DoctorsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [favouritesMap, setFavouritesMap] = useState(new Map()) // Map<doctorId, favouriteId>
  const [togglingId, setTogglingId] = useState(null)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        searchDoctors()
      } else {
        loadDoctors()
      }
    }, 500)

    return () => clearTimeout(delaySearch)
  }, [searchQuery])

  const loadData = async () => {
    await loadDoctors()
    if (isAuthenticated) {
      await loadFavourites()
    }
  }

  const loadDoctors = async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await doctorApi.getAllDoctors()
      console.log("[DoctorsPage] Fetched doctors:", data)
      setDoctors(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("[DoctorsPage] Error fetching doctors:", err)
      setError("Failed to load doctors. Please try again.")
      setDoctors([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadFavourites = async () => {
    try {
      const data = await favouriteApi.getUserFavourites()
      console.log("[DoctorsPage] Fetched favourites:", data)
      
      // Create a map of doctorId -> favouriteId
      const map = new Map()
      const favouritesList = Array.isArray(data) ? data : data?.data || []
      
      favouritesList.forEach(fav => {
        // Handle different possible response structures
        const doctorId = fav.doctorId || fav.doctor?.id
        const favouriteId = fav.id || fav.favouriteId
        
        if (doctorId && favouriteId) {
          map.set(doctorId, favouriteId)
        }
      })
      
      setFavouritesMap(map)
    } catch (err) {
      console.error("[DoctorsPage] Error fetching favourites:", err)
      // Don't show error for favourites fetching failure
    }
  }

  const searchDoctors = async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await doctorApi.searchByName(searchQuery)
      console.log("[DoctorsPage] Search results:", data)
      setDoctors(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("[DoctorsPage] Error searching doctors:", err)
      setError("Failed to search doctors. Please try again.")
      setDoctors([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFavouriteToggle = async (e, doctorId) => {
    e.stopPropagation() // Prevent navigation when clicking favourite button
    
    if (!isAuthenticated) {
      alert("Please sign in to add favourites")
      navigate("/signin")
      return
    }

    setTogglingId(doctorId)
    try {
      const isFavourite = favouritesMap.has(doctorId)
      
      if (isFavourite) {
        // Remove from favourites
        const favouriteId = favouritesMap.get(doctorId)
        console.log("[DoctorsPage] Removing favourite with ID:", favouriteId)
        await favouriteApi.removeFavourite(favouriteId)
        
        // Update local state
        setFavouritesMap(prev => {
          const newMap = new Map(prev)
          newMap.delete(doctorId)
          return newMap
        })
        console.log("[DoctorsPage] Successfully removed from favourites")
      } else {
        // Add to favourites
        console.log("[DoctorsPage] Adding favourite for doctor:", doctorId)
        const response = await favouriteApi.addFavourite(doctorId)
        console.log("[DoctorsPage] Add favourite response:", response)
        
        // Extract the favourite ID from response
        const favouriteId = response?.id || response?.favouriteId || doctorId
        
        // Update local state
        setFavouritesMap(prev => {
          const newMap = new Map(prev)
          newMap.set(doctorId, favouriteId)
          return newMap
        })
        console.log("[DoctorsPage] Successfully added to favourites")
      }
    } catch (err) {
      console.error("[DoctorsPage] Error toggling favourite:", err)
      alert(`Failed to ${favouritesMap.has(doctorId) ? "remove from" : "add to"} favourites. Please try again.`)
    } finally {
      setTogglingId(null)
    }
  }

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctor/${doctorId}`)
  }

  const getFilteredDoctors = () => {
    if (selectedSpecialty === "All") {
      return doctors
    }
    return doctors.filter(doctor => 
      doctor.specialty === selectedSpecialty || doctor.specialization === selectedSpecialty
    )
  }

  const filteredDoctors = getFilteredDoctors()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">All Doctors</h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-muted/50"
          />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {specialties.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? "default" : "outline"}
              onClick={() => setSelectedSpecialty(specialty)}
              className="whitespace-nowrap"
            >
              {specialty}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={loadDoctors} className="mt-4">
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{filteredDoctors.length} found</p>
              <Button variant="ghost" size="sm">
                Default ↕
              </Button>
            </div>

            <div className="space-y-4">
              {filteredDoctors.map((doctor) => {
                const isFavourite = favouritesMap.has(doctor.id)
                
                return (
                  <Card 
                    key={doctor.id} 
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleDoctorClick(doctor.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={doctor.photoUrl || "/placeholder.svg?height=80&width=80"}
                            alt={doctor.name}
                            className="w-20 h-20 rounded-2xl object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=80&width=80"
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                                {doctor.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {doctor.specialty || doctor.specialization}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`flex-shrink-0 transition-colors ${
                                isFavourite 
                                  ? "text-red-500 hover:text-red-600 hover:bg-red-50" 
                                  : "text-muted-foreground hover:text-red-500"
                              }`}
                              onClick={(e) => handleFavouriteToggle(e, doctor.id)}
                              disabled={togglingId === doctor.id}
                            >
                              {togglingId === doctor.id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <Heart 
                                  className={`h-5 w-5 ${isFavourite ? "fill-current" : ""}`} 
                                />
                              )}
                            </Button>
                          </div>
                          {doctor.location && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                              <MapPin className="h-4 w-4" />
                              {doctor.location}
                            </div>
                          )}
                          {doctor.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="font-medium text-foreground">{doctor.rating}</span>
                              {doctor.reviews && (
                                <span className="text-sm text-muted-foreground"> ({doctor.reviews} Reviews)</span>
                              )}
                            </div>
                          )}
                          {doctor.experience && (
                            <div className="flex items-center gap-1 mt-2">
                              <span className="text-xs text-muted-foreground">{doctor.experience}+ years experience</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {filteredDoctors.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No doctors found</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}