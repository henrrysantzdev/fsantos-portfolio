import { useLocation } from "react-router"

export function HomePage() {
  const { hash } = useLocation()
  return (
    <iframe
      title="KF Engenharia & Arquitetura"
      src={`/stitch/index.html${hash}`}
      className="fixed inset-0 z-50 h-dvh w-full border-0 bg-white"
    />
  )
}
