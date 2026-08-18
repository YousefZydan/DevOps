"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MessageCircle, X, Send, Loader2, Stethoscope } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"

/**
 * ⚠️ SECURITY NOTE — read before shipping to production
 * ---------------------------------------------------------------
 * This component calls Groq's API directly from the browser using
 * VITE_GROQ_API_KEY. Any key referenced via import.meta.env.VITE_*
 * is bundled into your JS and is visible to anyone who opens dev
 * tools — it is NOT secret once deployed. That's fine for an
 * internal demo, but for production you should move this fetch call
 * to your backend (e.g. POST /api/chat) and keep the Groq key as a
 * server-side secret. The frontend code below would then call your
 * own backend endpoint instead of api.groq.com directly.
 * ---------------------------------------------------------------
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_MODEL = "llama-3.3-70b-versatile"

// Must match the `name` values used in the Categories section of HomePage
const SPECIALTIES = [
  "Dentistry",
  "Cardiology",
  "Pulmonology",
  "General",
  "Neurology",
  "Gastroenterology",
  "Laboratory",
  "Vaccination",
]

const SYSTEM_PROMPT = `You are a friendly triage assistant for a healthcare booking app. Your job is to ask the patient short, simple follow-up questions about their symptoms (one or two at a time, not a long list) until you are confident enough to recommend which medical specialty they should book.

You must only recommend one of these specialties: ${SPECIALTIES.join(", ")}.

Rules:
- Keep replies short and conversational, like a helpful receptionist, not a doctor giving a diagnosis.
- Ask at most 2-3 follow-up questions before giving a recommendation.
- When you are ready to recommend, end your message with a separate final line in exactly this format: "Recommended specialty: <one of the list above>".
- Never attempt to diagnose a condition, prescribe treatment, or give medical advice beyond pointing to the right specialty.
- If the patient describes anything that sounds like a medical emergency (e.g. chest pain, difficulty breathing, severe bleeding, stroke symptoms), tell them to seek emergency care immediately instead of recommending a specialty.`

function extractSpecialty(text) {
  const match = text.match(/Recommended specialty:\s*([A-Za-z]+)/i)
  if (!match) return null
  const found = SPECIALTIES.find((s) => s.toLowerCase() === match[1].trim().toLowerCase())
  return found || null
}

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm here to help you find the right doctor. What symptoms are you experiencing today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen, isLoading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isLoading) return

    const nextMessages = [...messages, { role: "user", content: text }]
    setMessages(nextMessages)
    setInput("")
    setError(null)
    setIsLoading(true)

    try {
      if (!GROQ_API_KEY) {
        throw new Error("Missing VITE_GROQ_API_KEY environment variable")
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.4,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...nextMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      })

      if (!response.ok) {
        const errBody = await response.text()
        throw new Error(`Groq API error (${response.status}): ${errBody}`)
      }

      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content?.trim() || "Sorry, I didn't catch that. Could you rephrase?"
      const specialty = extractSpecialty(reply)

      setMessages((prev) => [...prev, { role: "assistant", content: reply, specialty }])
    } catch (err) {
      console.error(err)
      setError("Something went wrong reaching the assistant. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating action button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
        aria-label={isOpen ? "Close chat" : "Find the right doctor"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[28rem] flex flex-col overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary/90 to-primary text-white">
            <Stethoscope className="h-5 w-5" />
            <div>
              <p className="font-bold text-sm leading-tight">Find a Doctor</p>
              <p className="text-xs text-white/80 leading-tight">AI symptom assistant</p>
            </div>
          </div>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%]">
                  <div
                    className={`rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.specialty && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-2"
                      onClick={() => navigate(`/doctors?category=${encodeURIComponent(msg.specialty)}`)}
                    >
                      View {msg.specialty} doctors
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-xl px-3 py-2 bg-muted text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            {error && <p className="text-xs text-destructive">{error}</p>}
          </CardContent>

          <div className="border-t p-3">
            <p className="text-[10px] text-muted-foreground mb-2 leading-tight">
              This assistant suggests a specialty only — it isn't a diagnosis. In an emergency, call your local
              emergency number.
            </p>
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your symptoms..."
                className="h-10"
                disabled={isLoading}
              />
              <Button size="icon" onClick={sendMessage} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}