# CLAUDE.md — Nós Dois · Finanças (app)

Guia de trabalho + referência mestre do projeto. **Ler antes de mexer.**

---

## 1. O que é
- **PWA de finanças de um casal**, **arquivo único** `index.html` (HTML + CSS + JS vanilla, **sem build, sem framework**).
- Instalável no celular (PWA). Tema escuro, fonte Plus Jakarta Sans.
- Dados: `localStorage` + sincronização com **Firebase Firestore**. Login com **Google**.
- Deploy: **push na `main` → GitHub Pages publica sozinho.**
- Arquivos: `index.html` (tudo), `sw.js` (service worker/cache), `manifest.json`, `icon.svg`, `firestore.rules`.

---

## 2. 🔑 Chaves mestre (referência rápida)

> Valores **públicos/operacionais** (não são segredo). Os segredos de verdade estão na seção 7.

| Item | Valor |
|---|---|
| **Repo do app** | `github.com/worldkkevin-boop/financas-casal` |
| **URL do app (Pages)** | https://worldkkevin-boop.github.io/financas-casal/ |
| **Repo do bot** | `github.com/worldkkevin-boop/financas-bot` (deploy no **Railway**) |
| **Projeto Firebase** | `nos-dois-financas` (Console do Firebase) |
| **Firebase client config** | está no `FIREBASE_CONFIG` do `index.html` (apiKey/authDomain/projectId/etc. — config client é pública por design) |
| **authDomain** | `nos-dois-financas.firebaseapp.com` |
| **Doc do casal (Firestore)** | `couples/ZBWGP3` (Kevin = p1, Gabrielly = p2) |
| **AI Studio (por usuário)** | coleção `ai_management`, filtrada por `userId == uid` (exclusiva de cada login) |
| **Bot multi-tenant** | mapa em `botConfig/tenants` (JID da conversa → casal). Casal de teste do amigo: `amigo01` (solo) |
| **Versão atual** | ver `APP_VERSION` no topo do `<script>` (hoje: **v37**) |

---

## 3. ⚙️ Como trabalhar (fluxo de push DIRETO)

**Toda alteração no app vai pra produção via push direto na `main`** (não tem PR, não tem staging — o GitHub Pages publica sozinho). O ciclo padrão de QUALQUER mudança no `index.html`:

1. **Editar** o `index.html`.
2. **Subir a versão:** `APP_VERSION` (topo do script) **+** `CACHE` no `sw.js` — **mesmo número** (ex.: `v33` → `v34`). Sem isso o celular instalado fica preso na versão velha.
3. **Validar a sintaxe** dos `<script>` (comando abaixo) — só commitar se der **0 erros**.
4. **Commit + push direto na `main`** (mensagem em PT, terminando com a linha de co-autoria).
5. **Atualizar este `CLAUDE.md`** se a mudança for relevante (feature/aba nova, mudança de arquitetura, nova chave/URL) — no **mesmo commit**.
6. Pronto — em ~1 min o Pages publica. No app: **Config → Dados → 🔄 Atualizar** (ou Ctrl+Shift+R) puxa a versão nova.

> 📌 **REGRA DE OURO:** sempre que a gente mexer em algo, **este CLAUDE.md tem que ser atualizado junto**. Ele é a fonte da verdade do projeto — se ficar desatualizado, perde o valor.

**Validador de sintaxe (rodar antes do commit):**
```
node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');const re=/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;let m,i=0,b=0;while((m=re.exec(h))){i++;try{new Function(m[1])}catch(e){b++;console.log('ERRO',e.message)}}console.log('blocos',i,'erros',b)"
```

**Commit padrão:**
```
git add -A && git commit -m "descrição em PT; vXX

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>" && git push
```

---

## 4. 🧩 Tudo que o app tem (inventário de abas)

A navegação (`navTo`) tem estas abas (swipe lateral também troca de aba):

1. **Visão geral / Início** (`dashboard`) — montado por **widgets** que dá pra **mostrar/esconder/reordenar** (⚙ Personalizar início). Widgets em `DASH_WIDGETS`:
   - 💎 **Patrimônio do casal** (Em conta + carteira + metas + sonho − faturas; com botão 👁 esconder).
   - 📊 **Resumo do mês** — Receitas, Despesas (com nota *"↳ X no crédito (fatura)"*), Saldo do mês, Contas a pagar.
   - 💵 **Em conta** — saldo de cada um (✏️ ajusta → cria "⚖️ Ajuste de saldo").
   - 🔔 **Alertas** — salário não lançado, limite estourado.
   - 💳 **Cartões** — quando a fatura do mês está fechada+paga, mostra a **fatura aberta** (a que acumula).
   - 🐷 **Reserva da fatura** — fatura atual (paga ✅ / a pagar) **+ a próxima** 📅 adiantada.
   - ✈️ **Sonho** — resumo do sonho escolhido.
   - 🏷️ **Por categoria** · 🗺️ **Mapa de gastos** (heatmap do mês) · 📈 **Fluxo do mês** · 🧾 **Últimos lançamentos**.
2. **Lançamentos** (`transactions`) — lista por dia, com:
   - **Filtros** (busca, pessoa, categoria, **cartão**) — a busca atualiza **só a lista** (não perde o foco).
   - **Saldo corrente** por linha (`→ R$ X`, só sem filtro).
   - Botão **marcar pago/pendente** por lançamento (crédito segue a fatura).
   - Banner **"Recorrentes deste mês"** com botão **Receber/Lançar** por item (salário NÃO entra aqui — tem tratamento próprio).
3. **Orçamento** (`budget`) — limites por categoria com **slider de arrastar** (`budgetSliderInput` ao vivo / `budgetSliderCommit` ao soltar; arrastar até 0 remove). Botão **⚖️ Redistribuir** (`redistributeBudgets`) reequilibra proporcionalmente pra somar salário−poupança. Ao **remover** um limite, oferece redistribuir o que sobrou entre as outras. "Aplicar plano" (`applyPlan`) cria os limites iniciais pelo plano de salário.
4. **Metas / Caixinhas** (`goals`) — aportes pra objetivos.
5. **Carteira** (`portfolio`) — investimentos (ações/FII/RF/dólar).
6. **Sonho** (`dream`) — escolher um sonho (Sonho Americano ✈️, Casa 🏡/🏠, **Carro 🚗**, **Moto 🏍️**): intro, missões, hábitos diários com streak, "quanto custa" (`DREAM_COSTS`), card pra compartilhar. Sonhos em `DREAMS`/`DREAM_CHOICES`; carro e moto reusam `DREAM_VEICULO_PHASES/MISSIONS`.
7. **Anual** (`annual`) — visão dos 12 meses.
8. **AI Studio** (`ai`) — **EXCLUSIVA por usuário** (ver seção 6).
9. **Configurações** (`settings`) — conta Google, convite/casal, dia do pagamento, ciclo do pagamento, cartões, categorias, backup, 🔄 atualizar.

---

## 5. 🏗️ Arquitetura & padrões de código (seguir o que já existe)

- **Fonte:** Plus Jakarta Sans (única). Números com `tabular-nums`. **Dinheiro:** `fmt()` (R$), `dreamMoney()`/`fmtUSD()` (dólar no Sonho).
- **Estado:** `state` global; `saveState()` grava local + dispara `pushToFirebase()`; `subscribeFirebase()` aplica o doc remoto.
- **Campo novo que sincroniza:** adicionar em **3 lugares** → `defaultState()`, `pushToFirebase()` (objeto do `.set`) e `subscribeFirebase()` (aplicar do doc). (Campos dentro de `transactions[]` sincronizam sozinhos, pois o array vai inteiro.)
- **Trava anti-apagão:** `coupleLoaded` — `pushToFirebase()` NÃO escreve antes de carregar o casal (evita sobrescrever com estado vazio). **Nunca remover essa trava.**
- **Login:** Google (`onAuthStateChanged` → `authRouter`). Casal por convite, trava em 2 membros (`members`). PIN opcional.
- **Categorias:** fixas em `CATS_EXPENSE`/`CATS_INCOME`. Ocultar via `state.hiddenCats` + helper `catHidden(id)` — **filtrar em todo lugar que exibe**.
- **Mês/ciclo:** `cycleRange` respeita "mês começa no pagamento" (`state.paydayCycle` + `state.payday`). `getMonthTx()` usa isso.
- **Fatura do cartão:** `invoiceKeyFor(data, fechamento)` decide em qual fatura a compra cai. Fatura paga = `cardReserve.paid` (chave `mês-ano`). `txPaid(t)`: crédito segue a fatura; débito/pix = pago quando a data chega.
- **Import de fatura:** parcelas com **data real da compra** (mês a mês, flag `realDate`), `invoiceKeyFor` joga na fatura certa. Botão "🗑️ limpar importados do cartão" pra reimportar limpo.
- **Sincronia entre abas (só leitura, sem novo campo no Firebase):** Carteira mostra `renderGoalsLinkCard()` (metas/caixinhas/sonho espelhados) e botão "📥 Usar X do meu plano" que joga `state.savingsTarget` (Orçamento) no `state.portfolio.aporte`; o card "Sonho & Poupança" (Orçamento) mostra `portfolioTotal()` investido e leva pra Carteira. Os 3 números de aporte (`savingsTarget` no Orçamento, `goalRec` nas Metas, `portfolio.aporte` na Carteira) ainda são independentes — a liga é por referência cruzada, **não** crie campo sincronizado novo sem seguir a regra dos 3 lugares.
- **PWA:** `sw.js` é **network-first pro HTML** (pega versão nova online) + auto-reload no `controllerchange`. Botão "🔄 Atualizar" (`forceUpdate`).
- **Push / notificação com app fechado (FCM):** `registerPushToken()` (chamado no `enterApp`) pega o token FCM com `vapidKey` + a registration do `sw.js` e salva em `couples/{id}.pushTokens` (map token→info) via merge (não entra no `pushToFirebase`, sem apagão). O `sw.js` **inicializa o Firebase** (sem isso o `onBackgroundMessage` não dispara). Quem **envia** o push é o **bot** (`firebase-admin`, `src/push.js`) quando registra lançamento/lembrete. ⚠️ iPhone só recebe se o app estiver **instalado na tela inicial**. Requer permissão de notificação concedida.
  - **`saveFcmToken()`** ao salvar o token novo **remove os tokens antigos do mesmo usuário** (`pushTokens.{token} = delete`) — o token do FCM pode mudar (reinstalação/update do SW) e o antigo fica "fantasma" no map, fazendo o bot mandar a mesma notificação 2-3x pro mesmo aparelho. Self-heal: na próxima vez que o app abrir e registrar, os fantasmas são limpos.

---

## 6. 🤖 AI Studio (aba exclusiva — NÃO é do casal)

- Aba `ai` (`renderAI`) pra **controle dos serviços de IA** (gasto, renovação, retorno) — **de cada usuário, não do casal**.
- Guarda em coleção **separada** `ai_management`, cada doc com `userId`. Só aparece pra quem é dono (`userId == request.auth.uid`).
- **Nunca** misturar com o doc do casal (`couples/...`). É proposital ser isolado.
- Regras no `firestore.rules` (bloco `match /ai_management/{docId}`).
- Cada assinatura tem **🔄 Renovar agora** (`renewAI` — empurra `nextDate` +1 ciclo, avança até cair no futuro) e **🗑️ Cancelar** (`cancelAI` — apaga de vez). Alerta de renovação ≤7 dias no topo; "⚠️ Venceu" em vermelho quando passou. "Gasto Mensal Total" conta assinatura **anual ÷12** (`monthlyBRL`).

---

## 7. 🔒 SEGREDOS — NUNCA no repositório

Esses valores **jamais** entram no código/Git. Vivem só onde indicado:

| Segredo | Onde fica |
|---|---|
| Service account / `FIREBASE_PRIVATE_KEY` / `FIREBASE_CLIENT_EMAIL` | **Railway Variables** (bot) e Console do Firebase |
| `INGEST_TOKEN` (endpoints `/ingest`, `/report` do bot) | **Railway Variables** |
| `GEMINI_API_KEY`, `EVOLUTION_*` | **Railway Variables** |

- A **config client do Firebase** (apiKey etc. no `index.html`) **pode** ficar no repo — é pública por design; quem protege os dados são as **regras do Firestore**.
- Arquivos temporários de admin (`sa.json`, scripts `.cjs`) → **apagar logo após usar**. Iniciar o admin a partir da chave em memória quando possível, sem escrever em disco.
- Backups de dados (`_backup_couple_*.json`) → manter **fora** do repo do app.

---

## 8. 🔗 Integração com o bot (WhatsApp)
- O bot (`worldkkevin-boop/financas-bot`, Railway) compartilha o **mesmo** Firestore. Mantém o **formato dos lançamentos compatível** (ver `buildTx` no bot).
- O bot é **multi-tenant**: cada conversa (grupo/PV) aponta pro seu casal via `AsyncLocalStorage`. Mapa em `botConfig/tenants`. Onboarding pergunta o nome 1x e salva.
- Transferência **entre o casal** (Pix de um pro outro) só dispara quando os **dois nomes** aparecem juntos.

---

## 9. ✅ Regras obrigatórias (resumo)
1. Mexeu no `index.html` → **subir `APP_VERSION` + `CACHE` do `sw.js`** (mesmo nº).
2. **Validar sintaxe** (seção 3) antes de commitar — 0 erros.
3. **Push direto na `main`** (auto-deploy). Commit em PT + co-autoria.
4. **Nunca** commitar segredos (seção 7). Apagar temporários de admin.
5. **Manter arquivo único** — sem build, sem framework, sem quebrar em vários arquivos.
6. **Nunca** remover a trava `coupleLoaded` (anti-apagão).
7. **Atualizar este `CLAUDE.md`** SEMPRE que mexer em algo relevante (feature/aba nova, arquitetura, chave/URL) — no **mesmo commit** da mudança. É a regra de ouro.
