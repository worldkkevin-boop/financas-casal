# 💰 Nós Dois — Finanças

Sistema financeiro do casal, feito para funcionar direto no navegador (PC e celular).

## ✨ Funcionalidades

- 📊 **Dashboard** com resumo do mês (receitas, gastos, saldo)
- 💳 **Lançamentos** por data, categoria e forma de pagamento
- ⚖️ **Divisão inteligente** de gastos (50/50, proporcional à renda, personalizada)
- 🎯 **Metas** e sonhos do casal com progresso visual
- 🔐 **PIN de acesso** para privacidade
- 📱 **PWA** — instala no celular como app nativo
- 💾 **Export/Import JSON** para backup

---

## 🚀 Como colocar no GitHub Pages (grátis, privado)

### 1. Criar repositório
```bash
git init
git add .
git commit -m "primeiro commit"
```

### 2. Criar repositório no GitHub
- Acesse github.com → New repository
- Nome: `financas-casal` (ou qualquer nome)
- **Marque como Private** ✅
- Não inicialize com README

### 3. Subir o código
```bash
git remote add origin https://github.com/SEU_USER/financas-casal.git
git branch -M main
git push -u origin main
```

### 4. Ativar GitHub Pages
- Acesse: github.com → seu repositório → Settings → Pages
- Source: **Deploy from a branch**
- Branch: **main** / folder: **/ (root)**
- Clique em **Save**

### 5. Acessar
Após ~2 minutos, o app estará em:
```
https://SEU_USER.github.io/financas-casal/
```

### 6. Instalar no celular como app

**Android (Chrome):**
1. Abra a URL no Chrome
2. Menu ⋮ → "Adicionar à tela inicial"
3. Pronto! Ícone aparece na home screen

**iPhone (Safari):**
1. Abra a URL no Safari
2. Botão de compartilhar (□↑) → "Adicionar à Tela de Início"
3. Pronto!

---

## 🔒 Segurança

- **PIN padrão:** `1234` — altere nas Configurações assim que abrir
- Os dados ficam salvos localmente no navegador (localStorage)
- Nenhum dado é enviado para servidores externos
- Como o repositório é **privado** no GitHub, só vocês dois acessam

---

## 💡 Dicas de uso

- Crie lançamentos como **"Ambos"** para gastos compartilhados
- Use **"Divisão → Proporcional à renda"** quando as rendas forem diferentes
- Nas **Configurações**, coloque o nome e renda de cada um
- Use **Export** regularmente para fazer backup
- As metas ficam salvas e você pode depositar gradualmente

---

## 🛠️ Atualizações futuras (sugestões)

- [ ] Notificações de vencimento de contas
- [ ] Cartão de crédito com fatura mensal
- [ ] Orçamento por categoria
- [ ] Relatório anual
- [ ] Modo casal (sync entre dispositivos via GitHub ou API)
