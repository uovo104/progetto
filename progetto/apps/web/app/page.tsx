"use client"

import { FormEvent, useState } from "react"
import { Button } from "@workspace/ui/components/button"

type IssueSummary = {
  id: number
  title: string
  summary: string
  repo: string
  status: string
}

const initialIssues: IssueSummary[] = [
  {
    id: 1,
    title: "Aggiungere validazione al form di contatto",
    summary: "Il modello suggerisce di validare email e telefono prima di creare l'issue.",
    repo: "workspace/frontend",
    status: "Creato",
  },
  {
    id: 2,
    title: "Aggiornare documentazione API",
    summary: "Riassunto della trascrizione: aggiornare endpoint e parametri richiesti.",
    repo: "workspace/backend",
    status: "In attesa",
  },
]

export default function Page() {
  const [transcription, setTranscription] = useState("")
  const [issues, setIssues] = useState<IssueSummary[]>(initialIssues)
  const [emailSent, setEmailSent] = useState(false)
  const [summaryCreated, setSummaryCreated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateWorkflow = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!transcription.trim()) return

    setIsSubmitting(true)
    setEmailSent(false)
    setSummaryCreated(false)

    window.setTimeout(() => {
      const newIssue: IssueSummary = {
        id: Date.now(),
        title: "Issue generata dalla trascrizione",
        summary: transcription.slice(0, 120) + "...",
        repo: "workspace/operations",
        status: "Creato",
      }

      setIssues((current) => [newIssue, ...current])
      setEmailSent(true)
      setSummaryCreated(true)
      setIsSubmitting(false)
      setTranscription("")
    }, 800)
  }

  return (
    <main className="dark min-h-screen bg-background text-foreground px-6 py-10">
      <div className="relative">
        <div className="pointer-events-none hidden xl:flex absolute inset-y-0 left-0 w-32 flex-col items-center justify-center gap-6 bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617] text-center text-sm text-white/80 shadow-[inset_6px_0_24px_rgba(0,0,0,0.35)]">
          <span className="rotate-[-90deg] tracking-[0.35em] text-xs uppercase">Subway Surfers</span>
          <div className="h-24 w-24 rounded-full bg-white/10 p-4 text-[10px] leading-snug">
            Keep the attention
            <br /> high
          </div>
        </div>

        <div className="pointer-events-none hidden xl:flex absolute inset-y-0 right-0 w-32 flex-col items-center justify-center gap-6 bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617] text-center text-sm text-white/80 shadow-[inset_-6px_0_24px_rgba(0,0,0,0.35)]">
          <span className="rotate-[90deg] tracking-[0.35em] text-xs uppercase">Subway Surfers</span>
          <div className="h-24 w-24 rounded-full bg-white/10 p-4 text-[10px] leading-snug">
            Full speed
            <br /> ahead
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <header className="rounded-3xl border border-border bg-card/90 p-10 text-center shadow-xl shadow-black/20 backdrop-blur-xl">
          <h1 className="text-5xl font-semibold tracking-tight">Hello World 🚀</h1>
          <p className="mt-4 text-base text-muted-foreground">
            Esempio frontend: prendi una trascrizione, genera un issue GitHub, invia un'email di conferma e aggiunge un riassunto su Google Sheets.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <article className="rounded-3xl border border-border bg-card/80 p-8 shadow-xl shadow-black/10 backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Workflow simulato</h2>
                <p className="text-sm text-muted-foreground">
                  Inserisci una trascrizione di esempio e mostra il flusso di azioni.
                </p>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                dark mode
              </span>
            </div>

            <form onSubmit={handleCreateWorkflow} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="transcription">
                  Trascrizione
                </label>
                <textarea
                  id="transcription"
                  value={transcription}
                  onChange={(event) => setTranscription(event.target.value)}
                  rows={8}
                  placeholder="Incolla qui la trascrizione..."
                  className="w-full rounded-3xl border border-border bg-background/90 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Email di conferma</p>
                  <p className="mt-2 text-lg font-semibold">{emailSent ? "Invio simulato" : "In attesa"}</p>
                </div>
                <div className="rounded-3xl border border-border bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Riassunto Sheets</p>
                  <p className="mt-2 text-lg font-semibold">{summaryCreated ? "Aggiunto" : "In attesa"}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Azioni simulate:</p>
                  <ul className="list-inside list-disc pl-4">
                    <li>Creazione issue GitHub</li>
                    <li>Invio email di conferma</li>
                    <li>Aggiunta riassunto a Google Sheets</li>
                  </ul>
                </div>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Elaborazione..." : "Avvia workflow"}
                </Button>
              </div>
            </form>
          </article>

          <aside className="rounded-3xl border border-border bg-card/80 p-8 shadow-xl shadow-black/10 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold">Issue create</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Esempio di issue generate a partire da trascrizioni precedenti.
            </p>

            <div className="mt-6 space-y-4">
              {issues.map((issue) => (
                <div key={issue.id} className="rounded-3xl border border-border bg-background/90 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{issue.title}</h3>
                      <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{issue.repo}</p>
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                      {issue.status}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{issue.summary}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </div>
    </main>
  )
}
