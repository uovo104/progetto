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
  const [selectedIssueIds, setSelectedIssueIds] = useState<number[]>([])
  const [emailSent, setEmailSent] = useState(false)
  const [summaryCreated, setSummaryCreated] = useState(false)
  const [webhookStatus, setWebhookStatus] = useState("idle")
  const [webhookMessage, setWebhookMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateWorkflow = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!transcription.trim()) return

    setIsSubmitting(true)
    setEmailSent(false)
    setSummaryCreated(false)
    setWebhookStatus("sending")
    setWebhookMessage("")

    const newIssue: IssueSummary = {
      id: Date.now(),
      title: "Issue generata dalla trascrizione",
      summary: transcription.slice(0, 120) + "...",
      repo: "workspace/operations",
      status: "Creato",
    }

    setIssues((current) => [newIssue, ...current])

    try {
      const query = new URLSearchParams({ transcription })
      const response = await fetch(
        `http://localhost:5678/webhook-test/fcbd4300-3132-44b0-916e-b9bab27f2fde?${query.toString()}`,
        {
          method: "GET",
        }
      )

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Webhook error: ${response.status} ${errorData}`)
      }

      setWebhookStatus("sent")
      setWebhookMessage("Webhook inviato correttamente.")
    } catch (error) {
      setWebhookStatus("failed")
      setWebhookMessage(
        error instanceof Error ? error.message : "Errore invio webhook"
      )
    } finally {
      setEmailSent(true)
      setSummaryCreated(true)
      setIsSubmitting(false)
      setTranscription("")
    }
  }

  const allSelected = issues.length > 0 && selectedIssueIds.length === issues.length
  const hasSelection = selectedIssueIds.length > 0

  const toggleSelectIssue = (issueId: number) => {
    setSelectedIssueIds((current) =>
      current.includes(issueId)
        ? current.filter((id) => id !== issueId)
        : [...current, issueId]
    )
  }

  const toggleSelectAll = () => {
    setSelectedIssueIds(allSelected ? [] : issues.map((issue) => issue.id))
  }

  const deleteSelectedIssues = () => {
    if (!hasSelection) return

    setIssues((current) => current.filter((issue) => !selectedIssueIds.includes(issue.id)))
    setSelectedIssueIds([])
  }

  return (
    <main className="dark min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_30%),#010409] text-foreground px-4 py-8 md:px-6">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 md:px-0">
        <header className="mx-auto w-full max-w-5xl rounded-3xl border border-border bg-card/95 p-10 text-center shadow-xl shadow-black/20 backdrop-blur-xl">
          <h1 className="text-5xl font-semibold tracking-tight">Creazione issue su GitHub</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Inserisci una trascrizione, invia il payload al webhook e osserva le azioni simulate
            di issue GitHub, email di conferma e aggiunta a Google Sheets.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <article className="rounded-3xl border border-border bg-card/80 p-10 shadow-xl shadow-black/10 backdrop-blur-xl">
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

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-border bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Email di conferma</p>
                  <p className="mt-2 text-lg font-semibold">{emailSent ? "Invio simulato" : "In attesa"}</p>
                </div>
                <div className="rounded-3xl border border-border bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Riassunto Sheets</p>
                  <p className="mt-2 text-lg font-semibold">{summaryCreated ? "Aggiunto" : "In attesa"}</p>
                </div>
                <div className="rounded-3xl border border-border bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Webhook</p>
                  <p className="mt-2 text-lg font-semibold">
                    {webhookStatus === "sending"
                      ? "Invio..."
                      : webhookStatus === "sent"
                      ? "Attaccata"
                      : webhookStatus === "failed"
                      ? "Errore"
                      : "In attesa"}
                  </p>
                  {webhookMessage ? (
                    <p className="mt-2 text-xs text-muted-foreground">{webhookMessage}</p>
                  ) : null}
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
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? "Elaborazione..." : "Invia"}
                </Button>
              </div>
            </form>
          </article>

          <aside className="rounded-3xl border border-border bg-card/80 p-8 shadow-xl shadow-black/10 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Issue create</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Esempio di issue generate a partire da trascrizioni precedenti.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" size="sm" type="button" onClick={toggleSelectAll}>
                  {allSelected ? "Deseleziona tutte" : "Seleziona tutte"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  type="button"
                  onClick={deleteSelectedIssues}
                  disabled={!hasSelection}
                >
                  Elimina selezionate
                </Button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {issues.length === 0 ? (
                <div className="rounded-3xl border border-border bg-background/90 p-5 text-sm text-muted-foreground">
                  Nessuna issue presente.
                </div>
              ) : (
                issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="rounded-3xl border border-border bg-background/90 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <input
                          id={`select-${issue.id}`}
                          type="checkbox"
                          checked={selectedIssueIds.includes(issue.id)}
                          onChange={() => toggleSelectIssue(issue.id)}
                          className="h-5 w-5 rounded border-border bg-background text-primary focus:ring-primary"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{issue.title}</h3>
                          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                            {issue.repo}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                        {issue.status}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{issue.summary}</p>
                  </div>
                ))
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
