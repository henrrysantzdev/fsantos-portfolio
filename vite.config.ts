import fs from "node:fs"
import path from "node:path"
import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const root = import.meta.dirname

function readPortfolio() {
  const source = fs.readFileSync(path.resolve(root, "src/data/projects.ts"), "utf8")
  const categoriesBlock = source.slice(source.indexOf("export const CATEGORIES"), source.indexOf("export const projects"))
  const categories = [...categoriesBlock.matchAll(/(\w+):\s*"([^"]+)"/g)].map((match) => ({
    id: match[1],
    label: match[2],
  }))
  const jsonStart = source.indexOf("[", source.indexOf("=", source.indexOf("export const projects")))
  const jsonEnd = source.lastIndexOf("]", source.indexOf("export const softwares")) + 1
  const projects = JSON.parse(source.slice(jsonStart, jsonEnd)) as { t: string; s: string; c: string; img: string[] }[]
  const titles = new Set(projects.map((project) => project.t))
  if (!projects.length || !titles.has("Casa do Gabriel") || !titles.has("Casa Cetur") || titles.has("Casa do Gabriel & Cetur")) {
    throw new Error("A lista de projetos em src/data/projects.ts não confere com o acervo esperado.")
  }
  for (const project of projects) {
    if (!project.img.length) throw new Error(`Projeto sem imagens: ${project.t}`)
    for (const image of project.img) {
      if (!fs.existsSync(path.resolve(root, "public", image))) throw new Error(`Imagem ausente: ${image}`)
    }
  }
  return { categories, projects }
}

function portfolioDataPlugin(): Plugin {
  return {
    name: "portfolio-data",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split("?")[0] !== "/stitch/projects.json") return next()
        res.setHeader("Content-Type", "application/json; charset=utf-8")
        res.setHeader("Cache-Control", "no-store")
        res.end(JSON.stringify(readPortfolio()))
      })
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "stitch/projects.json", source: JSON.stringify(readPortfolio()) })
    },
  }
}

export default defineConfig({
  plugins: [portfolioDataPlugin(), react(), tailwindcss()],
  // Só arquivos com hash no nome vão para /static, que o netlify.toml cacheia como imutável; public/assets não tem hash.
  build: { assetsDir: "static" },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
