import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { CATEGORIES, projects, type Category } from "@/data/projects"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const filters = Object.entries(CATEGORIES) as ["all" | Category, string][]

export function Portfolio() {
  const [filter, setFilter] = useState<"all" | Category>("all")
  const [open, setOpen] = useState<{ title: string; images: string[]; index: number } | null>(null)
  const visible = projects.filter((project) => filter === "all" || project.c === filter)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null)
      if (event.key === "ArrowRight") setOpen((current) => current && { ...current, index: (current.index + 1) % current.images.length })
      if (event.key === "ArrowLeft")
        setOpen((current) => current && { ...current, index: (current.index - 1 + current.images.length) % current.images.length })
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <section id="portfolio" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
      <h2 className="border-l-4 border-primary pl-3 text-3xl font-semibold">Portfólio</h2>
      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map(([key, label]) => (
          <Button key={key} type="button" size="sm" variant={filter === key ? "default" : "outline"} onClick={() => setFilter(key)}>
            {label}
          </Button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <Card
            key={project.t}
            className="cursor-pointer overflow-hidden py-0 transition-transform hover:-translate-y-1"
            onClick={() => setOpen({ title: project.t, images: project.img, index: 0 })}
          >
            <img src={`/${project.img[0]}`} alt={project.t} className="aspect-video w-full object-cover" loading="lazy" />
            <div className="space-y-2 p-4">
              <h3 className="font-semibold">{project.t}</h3>
              <p className="text-sm text-muted-foreground">{project.s}</p>
              <div className="flex justify-between gap-2">
                <Badge variant="outline">{CATEGORIES[project.c]}</Badge>
                <Badge variant="secondary">
                  {project.img.length} imagem{project.img.length > 1 ? "s" : ""}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setOpen(null)}>
          <button type="button" className="absolute top-4 right-4 z-10 rounded-lg p-2 text-white" aria-label="Fechar" onClick={() => setOpen(null)}>
            <X className="size-8" />
          </button>
          <figure className="flex max-h-full w-full max-w-5xl flex-col items-center" onClick={(event) => event.stopPropagation()}>
            <img src={`/${open.images[open.index]}`} alt={open.title} className="max-h-[68vh] max-w-full object-contain" />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {open.title} — {open.index + 1}/{open.images.length}
            </figcaption>
            <div className="mt-3 flex gap-3">
              <Button
                type="button"
                variant="outline"
                aria-label="Anterior"
                onClick={() => setOpen({ ...open, index: (open.index - 1 + open.images.length) % open.images.length })}
              >
                <ChevronLeft />
                Anterior
              </Button>
              <Button
                type="button"
                variant="outline"
                aria-label="Próxima"
                onClick={() => setOpen({ ...open, index: (open.index + 1) % open.images.length })}
              >
                Próxima
                <ChevronRight />
              </Button>
            </div>
          </figure>
        </div>
      )}
    </section>
  )
}
