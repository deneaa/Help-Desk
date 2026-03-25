# Help-Desk 🎫

A web-based Help-Desk application built with Java Spring Boot.

## About
Help-Desk is a ticket management system that allows users to report
issues and track their resolution status. The application provides
a structured workflow for handling support requests efficiently.

## Students
- Berezlojan Denis - IA2401
- Bacalu Alexandr - IA2401

## Tech Stack
- **Backend:** Java 21, Spring Boot 3.5
- **Database:** PostgreSQL
- **Build Tool:** Maven
- **Frontend:** React 19 + TypeScript + Vite

## Project Structure
The application is built around 5 core entities:

- **User** — represents a system user with two roles: `USER` (opens tickets) and `AGENT` (manages and resolves tickets)
- **Ticket** — the core entity of the system; created by users and assigned to agents, with status tracking (`OPEN`, `IN_PROGRESS`, `CLOSED`) and category classification (`IT`, `HR`, `NETWORK`, `SOFTWARE`)
- **Comment** — messages left on a ticket; can be public (visible to the user) or internal (visible to agents only, used for workflow notes)
- **Notification** — automatically generated alerts sent to users when their ticket status changes or receives a new public comment
- **AuditLog** — a full history of all actions performed on a ticket; agents see the complete workflow, users see only relevant status updates

## Features (planned)
- 🎫 Create and manage support tickets
- 💬 Public and internal comments on tickets
- 👤 User authentication with role-based access (User / Agent)
- 🔔 Notifications for ticket updates
- 📋 Full audit log and ticket history

## Getting Started

### Backend
```bash
.\backend\mvnw -f backend/pom.xml spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```