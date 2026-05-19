# Beauty Store

Plataforma de e-commerce full-stack para loja de beleza, com sistema de recomendação por quiz, programa de fidelidade, programa de afiliados e integração com Mercado Pago.

---

## Tecnologias

### Frontend
- [Next.js](https://nextjs.org/) 16 + React 19
- TypeScript 5
- Tailwind CSS 4
- Zustand (gerenciamento de estado)
- Supabase (client-side)
- Framer Motion
- Axios

### Backend
- [FastAPI](https://fastapi.tiangolo.com/)
- Python 3.12+
- Supabase (PostgreSQL)
- JWT (autenticação)
- Mercado Pago (pagamentos)
- OpenAI (quiz de recomendação)
- Resend (e-mails transacionais)

---

## Funcionalidades

- Catálogo de produtos com coleções e variantes
- Autenticação de usuários com JWT
- Carrinho de compras e checkout
- Processamento de pagamentos via Mercado Pago
- Quiz de recomendação de produtos com IA (OpenAI)
- Sistema de pontos de fidelidade
- Programa de afiliados
- Lista de espera para produtos
- Notificações por e-mail
- SEO otimizado (sitemap, robots.txt, JSON-LD, metadados)

---

## Estrutura do Projeto

```
.
├── frontend/          # Aplicação Next.js
│   └── src/
│       ├── app/       # Rotas (App Router)
│       ├── components/
│       ├── lib/
│       └── store/     # Zustand stores
│
└── backend/           # API FastAPI
    └── app/
        ├── routers/   # Endpoints da API
        ├── models/    # Schemas Pydantic
        └── services/  # Lógica de serviços externos
```

---

## Configuração e Instalação

### Pré-requisitos

- Node.js 20+
- Python 3.12+
- Conta no [Supabase](https://supabase.com/)
- Credenciais: Mercado Pago, OpenAI, Resend

---

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
```

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_KEY` | Chave anon do Supabase |
| `SUPABASE_SERVICE_KEY` | Chave service_role do Supabase |
| `JWT_SECRET` | Segredo para geração de tokens JWT |
| `OPENAI_API_KEY` | Chave da API OpenAI |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de acesso Mercado Pago |
| `RESEND_API_KEY` | Chave da API Resend |
| `FRONTEND_URL` | URL do frontend (ex: `http://localhost:3000`) |

Inicie o servidor:

```bash
uvicorn main:app --reload
```

A API estará disponível em `http://localhost:8000`. Documentação interativa em `http://localhost:8000/docs`.

---

### Frontend

```bash
cd frontend
npm install
```

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.local.example .env.local
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## Scripts Disponíveis

### Frontend

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o linter |

### Backend

| Comando | Descrição |
|---|---|
| `uvicorn main:app --reload` | Inicia com hot-reload (desenvolvimento) |
| `uvicorn main:app` | Inicia em modo produção |

---

## Rotas da API

| Prefixo | Descrição |
|---|---|
| `/auth` | Autenticação (login, registro, tokens) |
| `/users` | Gerenciamento de usuários |
| `/products` | Produtos |
| `/collections` | Coleções |
| `/cart` | Carrinho de compras |
| `/orders` | Pedidos |
| `/payments` | Pagamentos (Mercado Pago) |
| `/quiz` | Quiz de recomendação |
| `/waitlist` | Lista de espera |
| `/points` | Pontos de fidelidade |
| `/affiliates` | Programa de afiliados |

---

## Deploy

- **Frontend:** Vercel (configurado via `VERCEL_URL`)
- **Backend:** Servidor compatível com ASGI (Uvicorn/Gunicorn)

O backend aceita requisições de `localhost:3000`, `beautystore.com.br` e deploys na Vercel via configuração de CORS.
