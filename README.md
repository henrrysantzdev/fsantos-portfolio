# FSantos Engenharia — site/portfólio

Site estático (HTML/CSS/JS puro, sem build), pronto para GitHub Pages.

- `index.html`: portfólio, softwares e **Orçamento online** (salva em Firestore `orcamentos`)
- `painel.html`: **Área restrita** (login Google, só `leyfps@gmail.com`)
- `assets/js/firebase-config.js`: configuração web do Firebase (pública)
- `assets/js/orcamento.js`: parâmetros de preço (`ORC_CONFIG`, da planilha `precificacao.xlsx`) e gerador da proposta
- Regras de segurança: `firestore.rules` (publicar no console do Firebase)

## Testar localmente

O login com Google **não funciona abrindo o arquivo direto (file://)**. Sirva a pasta por HTTP:

```powershell
cd D:\caminho\para\site
python -m http.server 8080
```

Abra http://localhost:8080/ e http://localhost:8080/painel.html
(`localhost` já vem autorizado no Firebase Authentication por padrão).

## Configuração no Console do Firebase (projeto fsantos-portfolio)

1. **Authentication > Sign-in method**: ative o provedor **Google**.
2. **Authentication > Settings > Authorized domains**: adicione `leysantos.github.io` (e o domínio próprio, se houver).
3. **Firestore Database**: banco `(default)` em `southamerica-east1`.
4. **Firestore > Regras**: cole o conteúdo de `firestore.rules` e publique.
5. Painel: a lista é ordenada por `createdAt` (índice de campo único, criado automaticamente).
