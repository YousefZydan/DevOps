"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MessageCircle, X, Send, Loader2, Stethoscope } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"

import { chatApi } from "../lib/api"

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
      const data = await chatApi.triage(
        nextMessages.map((m) => ({ role: m.role, content: m.content })),
      )
      const reply = data.reply?.trim() || "Sorry, I didn't catch that. Could you rephrase?"
      setMessages((prev) => [...prev, { role: "assistant", content: reply, specialty: data.specialty || null }])
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