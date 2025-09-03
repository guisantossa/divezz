# Divezz

Divezz é uma aplicação para gerenciar despesas compartilhadas (clone estilo Splitwise). Este repositório contém o frontend (React + Vite) e o backend (FastAPI + SQLAlchemy + Alembic).

## Estrutura do repositório
- `frontend/` — aplicação React (Vite)
- `backend/` — API FastAPI, modelos e migrações (Alembic)
- `migrations/` — versões Alembic (separado sob `backend/migrations` também)
- `.env` — arquivo de configuração (não comitar valores sensíveis)

## Pré-requisitos
- Node.js >= 18, npm
- Python 3.11
- Poetry (opcional, usado no backend)
- Docker (opcional, para containers)
- Um banco de dados PostgreSQL (ou ajuste DATABASE_URL para seu DB)

## Configuração rápida (desenvolvimento)

1. Clonar repositório
   - PowerShell:
     git clone <seu-repo-url>
     cd splitwise-clone

2. Backend
   - Entrar na pasta:
     cd backend
   - Criar ambiente e instalar dependências:
     - Com Poetry:
       poetry install
     - Ou com pip (se preferir virtualenv):
       python -m venv .venv
       .\.venv\Scripts\Activate
       pip install -r requirements.txt
   - Ajustar variáveis de ambiente:
     - Copie `.env.example` (se houver) para `.env` e configure `DATABASE_URL` sem expor segredos.
   - Rodar migrações (Alembic):
     poetry run alembic upgrade head
     (ou: alembic upgrade head se estiver no venv)
   - Subir a API:
     poetry run uvicorn app.main:app --reload --port 8000
   - A API ficará disponível em: http://localhost:8000

3. Frontend
   - Entrar na pasta:
     cd frontend
   - Instalar dependências:
     npm ci
   - Rodar em modo dev:
     npm run dev
   - App no navegador (Vite): normalmente http://localhost:5173

## Docker
- Backend Dockerfile já presente em `backend/Dockerfile`.
  - Build:
    docker build -t divezz-backend -f backend/Dockerfile backend
  - Run:
    docker run --rm -p 8000:8000 --env-file backend/.env divezz-backend
- Frontend Dockerfile já presente em `frontend/Dockerfile` (multistage com nginx).
  - Build:
    docker build -t divezz-frontend -f frontend/Dockerfile frontend
  - Run:
    docker run --rm -p 3000:80 divezz-frontend

Observação: não coloque credenciais sensíveis diretamente nos Dockerfiles nem no repositório. Use `.env` ou secrets no seu orquestrador.

## Migrações
- Criar revisão:
  poetry run alembic revision --autogenerate -m "mensagem"
- Aplicar:
  poetry run alembic upgrade head
- Reverter:
  poetry run alembic downgrade -1

## Testes
- Backend (pytest):
  cd backend
  poetry run pytest

## Boas práticas
- Nunca commitar `.env` com credenciais.
- Usar S3/Cloud storage para imagens em produção; para desenvolvimento pode-se usar `backend/static/uploads`.
- Ative `pool_pre_ping=True` no SQLAlchemy engine em produção para maior resiliência a conexões mortas.

## Contribuição
- Abra issues descrevendo bugs/novas features.
- Faça branches por tarefa/feature.
- Submeta PR com descrição e testes quando possível.

## Contato
- Projeto mantido localmente. Para dúvidas sobre execução ou erros, cole logs e o trecho relevante do código.