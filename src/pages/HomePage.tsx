import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router"

export function HomePage() {
  const { hash } = useLocation()
  const navigate = useNavigate()
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    let doc: Document | null = null

    // Links com target="_top" no iframe recarregariam o app inteiro; navega pelo router e mantém o shell já carregado.
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element | null)?.closest?.('a[target="_top"]') as HTMLAnchorElement | null
      if (!link) return
      const url = new URL(link.href)
      if (url.origin !== location.origin) return
      event.preventDefault()
      navigate(url.pathname + url.search + url.hash)
    }

    function bind() {
      doc?.removeEventListener("click", onClick)
      doc = frame?.contentDocument ?? null
      doc?.addEventListener("click", onClick)
    }

    bind()
    frame.addEventListener("load", bind)
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 2000))
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout
    const prefetch = idle(() => void import("@/pages/FerramentasPage"))
    return () => {
      frame.removeEventListener("load", bind)
      doc?.removeEventListener("click", onClick)
      cancelIdle(prefetch)
    }
  }, [navigate])

  return (
    <iframe
      ref={frameRef}
      title="KF Engenharia & Arquitetura"
      src={`/stitch/index.html${hash}`}
      className="fixed inset-0 z-50 h-dvh w-full border-0 bg-white"
    />
  )
}
