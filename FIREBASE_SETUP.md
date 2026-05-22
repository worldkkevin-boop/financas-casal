# 🔥 Configurar Firebase — Nós Dois Finanças

Com o Firebase, os dois celulares ficam sincronizados em tempo real e vocês recebem notificações quando o parceiro lança algo.

---

## Passo 1 — Criar projeto Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **+ Adicionar projeto**
3. Nome: `nos-dois-financas` (ou qualquer nome)
4. Desative o Google Analytics (opcional)
5. Clique em **Criar projeto**

---

## Passo 2 — Adicionar app Web

1. Na tela do projeto, clique no ícone **`</>`** (Web)
2. Apelido do app: `financas`
3. **Não marque** Firebase Hosting (vamos usar GitHub Pages)
4. Clique em **Registrar app**
5. Copie o objeto `firebaseConfig` — vai parecer assim:

```js
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "nos-dois-financas.firebaseapp.com",
  projectId: "nos-dois-financas",
  storageBucket: "nos-dois-financas.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

## Passo 3 — Habilitar Firestore

1. No menu lateral: **Firestore Database**
2. Clique em **Criar banco de dados**
3. Modo: **Modo de produção** (mais seguro)
4. Localização: `southamerica-east1` (São Paulo)
5. Clique em **Ativar**

### Regras de segurança (cole isso):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /couples/{coupleId}/{document=**} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ Essas regras permitem acesso a quem tiver o código do casal. Para uso privado de vocês dois, está ótimo.

---

## Passo 4 — Colar config no app

Abra `index.html` e procure:

```js
const FIREBASE_CONFIG = {
  apiKey: "",
  ...
};
```

Cole os valores do seu projeto Firebase. Exemplo:

```js
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "nos-dois-financas.firebaseapp.com",
  projectId: "nos-dois-financas",
  storageBucket: "nos-dois-financas.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

Também **descomente** as 3 linhas de import do Firebase no `<head>`:

```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"></script>
```

---

## Passo 5 — Conectar o segundo celular

1. Abra o app no **primeiro celular**
2. Faça login com o PIN
3. Vá em **Config → Parear** (ou toque em "Conectar com parceiro/a" na tela de login)
4. Você verá um **código de 6 letras** (ex: `ABC123`)
5. Compartilhe esse código com o segundo celular (WhatsApp, etc.)
6. No **segundo celular**, abra o app, toque em "Conectar com parceiro/a"
7. Cole o código e clique em **Entrar com este código**
8. Pronto! Os dados ficam sincronizados em tempo real ✅

---

## Passo 6 — Subir para GitHub Pages

```bash
git init
git add .
git commit -m "primeiro commit"
```

1. Crie um repositório **privado** no GitHub: `financas-casal`
2. Suba o código:
```bash
git remote add origin https://github.com/SEU_USER/financas-casal.git
git branch -M main
git push -u origin main
```
3. Vá em **Settings → Pages → Deploy from a branch → main / root**
4. Após ~2 min o app estará em `https://SEU_USER.github.io/financas-casal/`

---

## 🔔 Notificações push (opcional)

As notificações em tempo real já funcionam quando o app está aberto.

Para notificações **com o app fechado**, você precisa habilitar Cloud Messaging:

1. No Firebase Console: **Cloud Messaging**
2. Gere um par de chaves VAPID em: **Configurações do projeto → Cloud Messaging → Certificados push da Web**
3. Copie a chave pública e cole no app (campo `vapidKey` — instrução no código)

---

## ✅ Checklist

- [ ] Projeto Firebase criado
- [ ] App Web registrado e config copiado
- [ ] Firestore habilitado com regras
- [ ] Config colado no `index.html`
- [ ] SDKs descomentados no `<head>`
- [ ] App subido para GitHub Pages
- [ ] Código de casal compartilhado
- [ ] Segundo celular conectado
