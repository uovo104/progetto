"use client"

import { FormEvent, useState } from "react"
import { Button } from "@workspace/ui/components/button"

type Message = {
  id: number
  author: "You" | "Bot"
  text: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    author: "Bot",
    text: "Ciao! Scrivi un messaggio per iniziare la chat.",
  },
]

export default function Page() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = input.trim()
    if (!text) return

    const userMessage: Message = {
      id: Date.now(),
      author: "You",
      text,
    }

    setMessages((current) => [...current, userMessage])
    setInput("")
    setIsLoading(true)

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          author: "Bot",
          text: `Ho ricevuto il tuo messaggio: "${text}"`,
        },
      ])
      setIsLoading(false)
    }, 500)
  }

  return (
    <main className="dark min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-10">
      <section className="flex w-full max-w-3xl flex-col gap-6 rounded-3xl border border-border bg-card/80 p-8 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-5xl font-semibold tracking-tight">Hello World 🚀</h1>
          <p className="text-base text-muted-foreground">
            React, Tailwind CSS e shadcn/ui funzionano correttamente.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-background/80 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Chat demo</p>
              <p className="text-xs text-muted-foreground">
                Invia un messaggio e guarda la risposta automatica.
              </p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              dark mode
            </span>
          </div>

          <div className="flex max-h-96 flex-col gap-3 overflow-y-auto rounded-3xl border border-border bg-muted/10 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col gap-1 rounded-3xl px-4 py-3 shadow-sm ${
                  message.author === "You"
                    ? "self-end bg-primary text-primary-foreground"
                    : "self-start bg-background text-foreground"
                }`}
              >
                <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {message.author}
                </span>
                <p className="whitespace-pre-wrap text-sm">{message.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Scrivi qui..."
              className="flex-1 rounded-2xl border border-border bg-background/90 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? "Invio..." : "Invia"
              }
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}
