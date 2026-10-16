import { useEffect, useState } from "react"
import { Link } from "react-router"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const slides = [
  { src: "/assets/img/slider/s01-casa-vila-suica-01.jpg", label: "Casa Térrea Vila Suíça" },
  { src: "/assets/img/slider/s02-casa-vila-suica-04.jpg", label: "Casa Térrea Vila Suíça" },
  { src: "/assets/img/slider/s03-masterclin-03.jpg", label: "MasterClin" },
  { src: "/assets/img/slider/s04-projeto-ozires-02.jpg", label: "Projeto Ozires" },
  { src: "/assets/img/slider/s05-casa-gabriel-04.jpg", label: "Casa do Gabriel" },
  { src: "/assets/img/slider/s06-casa-vila-suica-06.jpg", label: "Casa Térrea Vila Suíça" },
  {
    src: "/assets/img/slider/calcfoundation-login.jpg",
    label: "FSantos CalcFoundation",
    href: "https://fsantoscalcfoundation.com.br/home",
    chip: "FSantos CalcFoundation — software de cálculo de fundações",
  },
  { src: "/assets/img/slider/s07-projeto-ozires-05.jpg", label: "Projeto Ozires" },
  { src: "/assets/img/slider/s08-casa-portinari-01.jpg", label: "Casa Portinari" },
  { src: "/assets/img/slider/s09-fotovoltaico-04.jpg", label: "Casa do Gabriel — fachada finalizada" },
  { src: "/assets/img/slider/s10-archirender-03.jpg", label: "Área de lazer — render Santos ArchiRender AI" },
  {
    src: "/assets/img/slider/archirender-login.jpg",
    label: "Santos ArchiRender AI",
    href: "https://santos-archirender-ai-96744710742.us-west1.run.app/",
    chip: "Santos ArchiRender AI — renderização com IA",
  },
  { src: "/assets/img/slider/s11-casa-vila-suica-02.jpg", label: "Casa Térrea Vila Suíça" },
  { src: "/assets/img/slider/s12-escola-metamorfose-03.jpg", label: "Escola Metamorfose" },
  { src: "/assets/img/slider/s13-casa-vila-suica-07.jpg", label: "Casa Térrea Vila Suíça" },
]

export function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const id = window.setTimeout(
      () => {
        if (!paused && !document.hidden) setIndex((i) => (i + 1) % slides.length)
      },
      reduce ? 7000 : 5000,
    )
    return () => window.clearTimeout(id)
  }, [index, paused])

  const slide = slides[index]

  return (
    <section
      className="relative flex min-h-[78vh] items-center justify-center overflow-hidden px-4 py-16 text-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((item, i) => (
        <div
          key={item.src}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-1000 motion-reduce:transition-none",
            i === index ? "opacity-100" : "opacity-0",
          )}
          style={{ backgroundImage: `url('${item.src}')`, filter: "blur(3.5px)", transform: "scale(1.06)" }}
        />
      ))}
      <div className="absolute inset-0 bg-[#10253f]/65" />
      <button
        type="button"
        aria-label="Slide anterior"
        className="absolute top-1/2 left-4 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white md:flex"
        onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        aria-label="Próximo slide"
        className="absolute top-1/2 right-4 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white md:flex"
        onClick={() => setIndex((i) => (i + 1) % slides.length)}
      >
        <ChevronRight />
      </button>
      <div className="relative z-10 mx-auto max-w-3xl">
        <img src="/assets/img/logo-kf.png" alt="Logo KF Engenharia" className="mx-auto mb-4 w-44 drop-shadow-lg sm:w-52" />
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">KF Engenharia</h1>
        <p className="mt-3 text-lg text-primary sm:text-xl">Projetos de engenharia e arquitetura em Manaus</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#orcamento" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>
            Gerar orçamento
          </a>
          <a href="#portfolio" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 border-primary px-5 text-primary")}>
            Ver projetos
          </a>
          <a
            href="https://wa.me/5592992262786"
            target="_blank"
            rel="noopener"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 border-primary px-5 text-primary")}
          >
            Fale no WhatsApp
          </a>
        </div>
        <Link
          to="/ferramentas"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-5 h-11 gap-2 border-primary px-4 text-primary")}
        >
          <Badge>NOVO</Badge>
          Ferramentas grátis de pré-dimensionamento
        </Link>
      </div>
      {slide.chip && slide.href && (
        <a
          href={slide.href}
          target="_blank"
          rel="noopener"
          className="absolute bottom-14 left-1/2 z-10 max-w-[92vw] -translate-x-1/2 truncate rounded-full border border-primary bg-background/80 px-3 py-1 text-sm text-primary"
        >
          {slide.chip}
        </a>
      )}
      <div className="absolute bottom-5 left-0 z-10 flex w-full justify-center gap-2">
        {slides.map((item, i) => (
          <button
            key={item.src}
            type="button"
            aria-label={`Slide ${i + 1}`}
            className={cn("h-2 rounded-full bg-white/40", i === index ? "w-6 bg-primary" : "w-2")}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}
