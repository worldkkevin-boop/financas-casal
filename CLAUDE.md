# CLAUDE.md — Nós Dois · Finanças (app)

Regras de trabalho neste repositório. Ler antes de mexer.

## O que é
- PWA de finanças de um casal, **arquivo único** `index.html` (HTML + CSS + JS vanilla, **sem build, sem framework**).
- Dados: `localStorage` + sincronização com **Firebase Firestore** (doc `couples/{coupleId}`), auth anônima.
- Deploy: **push na `main` → GitHub Pages publica sozinho.** Repo: `worldkkevin-boop/financas-casal`.
- Arquivos: `index.html` (tudo), `sw.js` (service worker/cache), `manifest.json`, `icon.svg`.

## Regras obrigatórias
1. **Versão + cache:** ao alterar `index.html`, subir `APP_VERSION` (no topo do script) **e** `CACHE` no `sw.js` (mesmo número, ex. `v13`). Sem isso o celular instalado fica preso na versão velha.
2. **Validar sintaxe antes de commitar:**
   ```
   node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');const re=/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;let m,i=0,b=0;while((m=re.exec(h))){i++;try{new Function(m[1])}catch(e){b++;console.log('ERRO',e.message)}}console.log('blocos',i,'erros',b)"
   ```
3. **Segredos:** nunca commitar service-account/chaves. A config do Firebase no client é ok. Arquivos temporários de admin (`sa.json`) → **apagar logo após usar**.
4. **Manter arquivo único** — nada de quebrar em vários arquivos nem adicionar dependências/build.
5. **Commits:** mensagem em PT, terminando com `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## Padrões de código (seguir o que já existe)
- **Fonte:** Plus Jakarta Sans (única). **Logo:** dois elos entrelaçados (ver `icon.svg` / `.brand-mark`). Números com `tabular-nums`.
- **Dinheiro:** usar `fmt()` (R$) e `dreamMoney()`/`fmtUSD()` (dólar no Sonho).
- **Campo novo que sincroniza:** adicionar em **3 lugares** → `defaultState()`, `pushToFirebase()` (objeto do `.set`) e `subscribeFirebase()` (aplicar do doc).
- **Categorias:** fixas em `CATS_EXPENSE`/`CATS_INCOME`. Ocultar via `state.hiddenCats` — e **filtrar em todo lugar que exibe** (orçamento: linhas + lista de adicionar; dashboard "por categoria"; alertas; seletor de lançamento via `populateCats`). Helper: `catHidden(id)`.
- **Orçamento:** limites são **fixos e independentes** (mexer numa NÃO altera as outras). "Aplicar plano" é a única coisa que distribui.
- **Dashboard:** é por **widgets** (`DASH_WIDGETS` + layout salvo no `localStorage`, editor `renderDashEditor`).
- **Sonho:** `ensureDream()` faz migrações; `syncDreamMissions()` injeta missões novas do catálogo sem perder progresso; flag `chosen` controla a tela de intro (`renderDreamIntro`). Hábitos são **diários com streak** (`doneDates`, `habitStreak`).
- **PWA:** `sw.js` é network-first pro HTML (pega versão nova online) + auto-reload no `controllerchange`. Tem botão "🔄 Atualizar" nas Config (`forceUpdate`).

## Integração com o bot
- O app e o bot WhatsApp (`worldkkevin-boop/financas-bot`) compartilham o **mesmo** doc Firebase (`couples/{coupleId}`). Manter o **formato dos lançamentos compatível** entre os dois (ver `buildTx` no bot).
