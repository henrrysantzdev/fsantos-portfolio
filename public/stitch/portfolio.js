const PAGE_SIZE = 9
const state = { category: "all", shown: PAGE_SIZE, projects: [], categories: [] }
const tabOn = "portfolio-tab px-4 py-2 rounded-full font-title-md text-body-md whitespace-nowrap transition-colors bg-white text-surface font-bold"
const tabOff = "portfolio-tab px-4 py-2 rounded-full font-title-md text-body-md whitespace-nowrap transition-colors bg-surface-container text-secondary hover:text-on-surface"
const badgeBase = "portfolio-category absolute bottom-3 left-3 px-3 py-1 rounded font-label-badge text-label-badge font-bold"
const badgeTone = {
  res: "bg-tertiary-container text-on-tertiary-container",
  com: "bg-primary-container text-on-primary",
  ins: "bg-tertiary text-on-tertiary",
  inf: "bg-secondary text-on-secondary",
  pub: "bg-secondary-container text-on-secondary-container",
}

const filters = document.querySelector("#portfolio-filter-buttons")
const grid = document.querySelector("#portfolio-cards-grid")
const count = document.querySelector("#portfolio-count")
const more = document.querySelector("#portfolio-more")
const template = document.querySelector("#portfolio-card-template")

const dialog = document.createElement("dialog")
dialog.className = "project-image-dialog"
dialog.setAttribute("aria-labelledby", "project-image-title")
dialog.innerHTML = `<div class="image-dialog-heading"><h2 id="project-image-title"></h2><p id="project-image-count" aria-live="polite"></p><button type="button" aria-label="Fechar">✕</button></div><img alt="" /><div class="gallery-nav"><button type="button" data-step="-1">Anterior</button><button type="button" data-step="1">Próxima</button></div>`
document.body.append(dialog)

const dialogImage = dialog.querySelector("img")
const dialogTitle = dialog.querySelector("#project-image-title")
const dialogCount = dialog.querySelector("#project-image-count")
const previousButton = dialog.querySelector('[data-step="-1"]')
const nextButton = dialog.querySelector('[data-step="1"]')
const gallery = { images: [], index: 0, title: "", opener: null }

function imageWord(total) {
  return total === 1 ? "1 imagem" : `${total} imagens`
}

function imageUrl(path) {
  return `/${path.replace(/^\//, "")}`
}

function thumbUrl(path) {
  return `/assets/img/thumb/${path.split("/").pop()}`
}

function categoryLabel(id) {
  return state.categories.find((category) => category.id === id)?.label ?? id
}

function filteredProjects() {
  if (state.category === "all") return state.projects
  return state.projects.filter((project) => project.c === state.category)
}

function paintFilters() {
  filters.replaceChildren()
  for (const category of state.categories) {
    const button = document.createElement("button")
    const selected = category.id === state.category
    button.type = "button"
    button.className = selected ? tabOn : tabOff
    button.dataset.category = category.id
    button.textContent = category.label
    button.setAttribute("aria-pressed", String(selected))
    button.addEventListener("click", () => {
      if (state.category === category.id) return
      state.category = category.id
      state.shown = PAGE_SIZE
      filters.querySelectorAll(".portfolio-tab").forEach((tab) => {
        const active = tab.dataset.category === category.id
        tab.className = active ? tabOn : tabOff
        tab.setAttribute("aria-pressed", String(active))
      })
      paintProjects(0)
    })
    filters.append(button)
  }
}

function createCard(project, eager) {
  const card = template.content.firstElementChild.cloneNode(true)
  const image = card.querySelector("img")
  const open = card.querySelector("button")
  const total = project.img.length
  image.addEventListener("error", () => { image.src = imageUrl(project.img[0]) }, { once: true })
  image.src = thumbUrl(project.img[0])
  image.width = 640
  image.height = 400
  image.alt = ""
  image.decoding = "async"
  image.loading = eager ? "eager" : "lazy"
  card.querySelector(".portfolio-count").textContent = imageWord(total)
  const badge = card.querySelector(".portfolio-category")
  badge.className = `${badgeBase} ${badgeTone[project.c] ?? badgeTone.res}`
  badge.textContent = categoryLabel(project.c)
  card.querySelector("h3").textContent = project.t
  card.querySelector("p").textContent = project.s
  card.dataset.category = project.c
  open.setAttribute("aria-label", `Abrir ${project.t}, ${imageWord(total)}`)
  open.addEventListener("click", () => openGallery(project, open))
  return card
}

function paintProjects(start) {
  const list = filteredProjects()
  const shown = Math.min(state.shown, list.length)
  if (start === 0) grid.replaceChildren()
  let firstNew = null
  for (let index = start; index < shown; index += 1) {
    const card = createCard(list[index], start === 0 && index < 3)
    grid.append(card)
    firstNew ??= card
  }
  count.textContent = `Exibindo ${shown} de ${list.length} projetos`
  more.hidden = shown >= list.length
  if (start > 0 && firstNew) {
    const target = firstNew.querySelector("button")
    setTimeout(() => target.focus({ preventScroll: true }), 0)
  }
}

function showImage(index) {
  const total = gallery.images.length
  gallery.index = (index + total) % total
  const current = gallery.index + 1
  dialogTitle.textContent = gallery.title
  dialogCount.textContent = `${current} de ${total}`
  dialogImage.alt = `${gallery.title}, imagem ${current} de ${total}`
  dialogImage.src = imageUrl(gallery.images[gallery.index])
  const single = total < 2
  previousButton.disabled = single
  nextButton.disabled = single
}

function openGallery(project, opener) {
  gallery.images = project.img
  gallery.title = project.t
  gallery.opener = opener
  showImage(0)
  dialog.showModal()
}

dialog.querySelector(".image-dialog-heading button").addEventListener("click", () => dialog.close())
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close()
})
dialog.addEventListener("close", () => {
  const opener = gallery.opener
  dialogImage.removeAttribute("src")
  setTimeout(() => opener?.focus(), 0)
})
dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault()
    if (!nextButton.disabled) showImage(gallery.index + 1)
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault()
    if (!previousButton.disabled) showImage(gallery.index - 1)
  }
})
previousButton.addEventListener("click", () => showImage(gallery.index - 1))
nextButton.addEventListener("click", () => showImage(gallery.index + 1))
more.addEventListener("click", () => {
  const start = Math.min(state.shown, filteredProjects().length)
  state.shown += PAGE_SIZE
  paintProjects(start)
})

fetch("/stitch/projects.json")
  .then((response) => {
    if (!response.ok) throw new Error("portfolio")
    return response.json()
  })
  .then((data) => {
    state.categories = data.categories
    state.projects = data.projects
    paintFilters()
    paintProjects(0)
  })
  .catch(() => {
    count.textContent = "Não foi possível carregar os projetos."
    more.hidden = true
  })
