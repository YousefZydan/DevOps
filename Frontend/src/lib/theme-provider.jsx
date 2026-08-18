"use client"

import React from "react"

// Simple theme provider without next-themes dependency
export function ThemeProvider({ children }) {
  React.useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const theme = savedTheme || (prefersDark ? "dark" : "light")

    // Apply theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  return children
}
