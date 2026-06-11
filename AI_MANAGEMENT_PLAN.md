# Plano de Implementação: Aba Exclusiva de Gestão de IA 🤖

Este documento descreve as etapas para criar uma aba exclusiva e privada dentro do app "Nós Dois" (ou como um módulo separado) para o gerenciamento de serviços de Inteligência Artificial.

## 1. Conceito e Privacidade

Para garantir que a aba seja **exclusiva para você** e não misture com as finanças do casal:
- **Filtro por E-mail:** A aba só ficará visível e acessível se o usuário logado for o seu e-mail específico.
- **Isolamento de Dados:** Os dados de IA serão salvos em uma coleção separada no Firestore (`ai_management`), com regras de segurança que permitem acesso **apenas ao seu UID de usuário**.

## 2. Estrutura de Dados (O que vamos registrar)

Cada serviço de IA terá os seguintes campos:
- **Nome do Serviço:** (Ex: ChatGPT, Midjourney, API Anthropic)
- **Custo:** Valor da assinatura.
- **Moeda:** (BRL/USD) - Importante para serviços pagos em dólar.
- **Ciclo de Renovação:** (Mensal/Anual) e a **Data da Próxima Renovação**.
- **Categoria:** (Texto, Imagem, Programação, Produtividade).
- **Status:** (Ativo, Pausado, Cancelado).
- **Retorno/ROI:** Campo de notas para registrar o que essa IA trouxe de ganho (produtividade, dinheiro, tempo).

## 3. Interface do Usuário (UI)

A nova aba "**IA Studio**" (sugestão de nome) terá:
- **Dashboard Resumo:** Gasto total mensal em IA (convertendo USD se necessário) e lista de renovações próximas.
- **Lista de Assinaturas:** Cards modernos com o status e valor de cada uma.
- **Formulário de Cadastro:** Para adicionar novos serviços rapidamente.
- **Filtro de ROI:** Uma visão focada no que está dando retorno e o que pode ser cortado.

## 4. Passos para Implementação Técnica

### Passo 1: Configuração no Firebase
1.  Criar a coleção `ai_management` no Firestore.
2.  Atualizar o arquivo `firestore.rules` para garantir que ninguém mais (nem o parceiro no modo casal) consiga ler esses documentos.
    ```javascript
    match /ai_management/{docId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    ```

### Passo 2: Alterações no `index.html`
1.  **Novo Botão de Navegação:** Adicionar o botão "🤖 IA" na `nav-tabs`. Ele terá um `style="display:none"` por padrão.
2.  **Lógica de Visibilidade:** No script de inicialização, verificar:
    ```javascript
    if (user.email === 'seu-email@gmail.com') {
      document.getElementById('tabAI').style.display = 'flex';
    }
    ```
3.  **Renderização da Aba:** Criar a função `renderAI()` para desenhar a interface da nova aba.

### Passo 3: Lógica de Negócio
1.  Criar funções CRUD (`saveAIService`, `deleteAIService`, `getAIServices`).
2.  Implementar um conversor simples de Moeda para o Dashboard (usando uma cotação fixa ou API).

## 5. Próximos Passos

Assim que você aprovar este plano, as ações serão:
1.  **Definir o e-mail master** que terá acesso a essa aba.
2.  **Aplicar o código inicial** para a nova aba e o botão de navegação.
3.  **Configurar as regras do Firebase** para total privacidade.

---
*Este projeto mantém a agilidade do app atual (PWA) mas cria uma "área VIP" totalmente isolada das finanças domésticas.*
