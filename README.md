# 📚 Library Reservation System

A full-stack library application where patrons can browse and reserve books to check out.

## 🔧 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React, TypeScript)
- **Backend**: [.NET 8 Web API](https://dotnet.microsoft.com/)
- **Authentication**: [Authentik](https://goauthentik.io/)
- **Database**: PostgreSQL (via Docker)
- **DevOps**: Docker Compose

---

## 🚀 Features

- Patron authentication via Authentik (SSO/OIDC)
- Browse available books
- Reserve a book if available
- Admin seed data and basic management via API

---

## 📦 Running Locally with Docker Compose

> Requires: [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/)

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
docker compose up --build
