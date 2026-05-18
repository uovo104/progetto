import { Button } from "@workspace/ui/components/button"

export default function Page() {
  return (
    <main className="dark min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-10">
      <section className="flex w-full max-w-3xl flex-col items-center justify-center gap-8 rounded-3xl border border-border bg-card/90 p-12 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="space-y-4 text-center">
          <h1 className="text-5xl font-semibold tracking-tight">Hello World 🚀</h1>
          <p className="text-base text-muted-foreground">
            React, Tailwind CSS e shadcn/ui funzionano correttamente.
          </p>
        </div>

        <Button size="lg">Button shadcn</Button>
      </section>
    </main>
  )
}
