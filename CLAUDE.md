# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Library Reservation System - a full-stack application where patrons can browse and reserve books. The project is in early development phase with only foundational setup completed.

## Technology Stack

- **Frontend**: Next.js (React, TypeScript)
- **Backend**: .NET 8 Web API  
- **Authentication**: Authentik (SSO/OIDC provider)
- **Database**: PostgreSQL
- **DevOps**: Docker Compose

## Architecture

### Authentication Flow
The system uses Authentik as an external OIDC provider for authentication. Both the Next.js frontend and .NET backend will integrate with Authentik for user authentication and authorization.

### Current Infrastructure
- PostgreSQL database service (via Docker)
- Redis cache (for Authentik)
- Authentik server and worker services
- Frontend and backend application services are not yet implemented

## Development Environment

### Prerequisites
- Docker and Docker Compose
- Environment variable `POSTGRES_PASSWORD` must be set

### Running Services
```bash
# Start infrastructure services (PostgreSQL, Redis, Authentik)
docker compose up --build
```

### Authentik Configuration
- Admin interface: http://localhost:9000
- HTTPS interface: https://localhost:9443
- Requires initial setup and OIDC application configuration

## Development Status

**Current State**: Project initialization phase
- ✅ Docker infrastructure setup
- ✅ Basic documentation
- ❌ Frontend Next.js application (not implemented)
- ❌ Backend .NET 8 Web API (not implemented)
- ❌ Database schema/migrations (not implemented)
- ❌ Build and test scripts (not implemented)

## Key Implementation Areas

1. **Frontend Development**
   - Next.js app with TypeScript
   - Authentik OIDC integration
   - Book browsing and reservation UI

2. **Backend Development**
   - .NET 8 Web API controllers
   - Entity Framework with PostgreSQL
   - OIDC authentication middleware
   - Book and reservation management APIs

3. **Database Design**
   - Books, Authors, Patrons, Reservations entities
   - PostgreSQL schema with proper relationships

4. **Docker Integration**
   - Add frontend and backend services to docker-compose.yml
   - Multi-stage builds for production deployments

## Features to Implement

- Patron authentication via Authentik
- Book browsing and search
- Book reservation system
- Admin management APIs
- Basic book inventory management