# Backend for Multi-Tenant Application with RBAC and Sharding

This backend serves a multi-tenant architecture with role-based access control (RBAC) and MongoDB sharding using Prisma. It handles tenant authentication, authorization, and user management.

## Features

- RBAC middleware to enforce roles and permissions
- Tenant-based routing and authentication logic
- Prisma ORM to handle MongoDB connections and schema management
- Sharded database design for scalability

## Setup

1. Clone this repository.
2. Install dependencies: `npm install`
3. Configure `.env` for database connection and JWT secrets.
4. Run Prisma migrations: `npx prisma migrate dev`
5. Start the server: `npm run start`

## Routes

- `/auth/login` - Login endpoint for tenants
- `/tenants` - CRUD operations for tenants
- `/users` - User management
