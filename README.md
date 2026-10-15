# FSantos Engenharia — site/portfólio

Site em React, Vite, Tailwind CSS e shadcn/ui.

- `/` portfólio, softwares e orçamento online (Firestore `orcamentos`)
- `/ferramentas` calculadoras de pré-dimensionamento
- `/painel` área restrita (login Google, só `leyfps@gmail.com`)
- `firestore.rules` regras de segurança (publicar no console do Firebase)

## Desenvolvimento

```powershell
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (em geral http://localhost:5173/). O login com Google precisa de HTTP, não de `file://`.

## Build

```powershell
npm run build
```

A pasta `dist` é o que a Netlify publica (`netlify.toml`).
