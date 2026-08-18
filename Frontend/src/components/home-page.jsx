"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  MapPin,
  Search,
  Heart,
  Stethoscope,
  Blinds as Lungs,
  Star,
  Activity,
  Brain,
  TestTube,
  Syringe,
  ChevronDown,
} from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import ChatBotWidget from "./ChatBotWidget"

const categories = [
  { name: "Dentistry", icon: Activity, color: "bg-rose-100 text-rose-600" },
  { name: "Cardiology", icon: Heart, color: "bg-emerald-100 text-emerald-600" },
  { name: "Pulmonology", icon: Lungs, color: "bg-amber-100 text-amber-600" },
  { name: "General", icon: Stethoscope, color: "bg-purple-100 text-purple-600" },
  { name: "Neurology", icon: Brain, color: "bg-teal-100 text-teal-600" },
  { name: "Gastroenterology", icon: Activity, color: "bg-slate-800 text-white" },
  { name: "Laboratory", icon: TestTube, color: "bg-rose-100 text-rose-600" },
  { name: "Vaccination", icon: Syringe, color: "bg-cyan-100 text-cyan-600" },
]

const medicalCenters = [
  {
    name: "Sunrise Health Clinic",
    address: "123 Oak Street, CA 98765",
    rating: 5.0,
    reviews: 58,
    distance: "2.5 km",
    type: "Hospital",
    image: "/images/image.png",
  },
  {
    name: "Golden Cardiology Center",
    address: "555 Bridge Street, CA 98765",
    rating: 4.9,
    reviews: 102,
    distance: "2.3 km",
    type: "Hospital",
    image: "/images/image.png",
  },
]

export default function HomePage() {
  const [location, setLocation] = useState("Seattle, USA")
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location & Search */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <button className="flex items-center gap-2 text-foreground font-medium">
              {location}
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="text" placeholder="Search Doctor, Hospital..." className="pl-10 h-12 bg-muted/50" />
          </div>
        </div>

        {/* Hero Banner */}
        <Card className="mb-8 overflow-hidden bg-gradient-to-r from-primary/90 to-primary">
          <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-balance">Looking for Specialist Doctors?</h2>
              <p className="text-white/90 mb-4">Schedule an appointment with our top doctors.</p>
              <Button variant="secondary" size="lg" onClick={() => navigate("/doctors")}>
                Book Now
              </Button>
            </div>
            <div className="flex-shrink-0">
              <img
                src="/female-doctor-smiling.png"
                alt="Doctor"
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground">Categories</h3>
            <Button variant="ghost" size="sm">
              See All
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.name}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className={`p-3 rounded-xl ${category.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-center text-foreground">{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Nearby Medical Centers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground">Nearby Medical Centers</h3>
            <Button variant="ghost" size="sm">
              See All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {medicalCenters.map((center) => (
              <Card key={center.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-48 w-full">
                    <img
                      src={`/placeholder.svg?height=200&width=400&query=modern hospital interior`}
                      alt={center.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg text-foreground mb-2">{center.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{center.address}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-foreground">{center.rating}</span>
                        <span className="text-sm text-muted-foreground">({center.reviews} Reviews)</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{center.distance}</span>
                        <span className="px-2 py-1 bg-muted rounded-md text-xs">{center.type}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Chatbot button + panel — find the right doctor */}
      <ChatBotWidget />
    </div>
  )
}