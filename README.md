<h1 align="center">Multi-Tenant Application System</h1>
<p align="center"><a href="#project-description">Project Description</a> - <a href="#key-features">Key Features</a> - <a href="#technology-stack">Tech Stack</a></p>

## Project Description

A scalable multi-tenant system application utilizing role-based access control (RBAC), with MongoDB sharding and a tenant management dashboard.

## Key Features

*   Multi-Tenant Architecture
*   RBAC middleware for secure role management
*   MongoDB Sharding for scalability
*   Tenant-specific dashboard and subscription management
*   User activity tracking

## Tech Stack

**Frontend**: React + Vite, Tailwind CSS, Material UI  
**Backend**: Node.js, Express, MongoDB, Prisma, JWT  
**Cloud**: Docker


backend/<br>
└── src/<br>
├── controllers/<br>
├── middlewares/<br>
├── prisma/<br>
├── routes/<br>
├── types/<br>
├── utils/<br>
└── app.ts<br>
frontend/<br>
└── src/<br>
├── components/<br>
│ ├── subscription/<br>
│ ├── userActivity/<br>
│ ├── sidebar/<br>
│ ├── tenantForm/<br>
│ ├── tenantList/<br>
│ └── tenantMetrics/<br>
├── context/<br>
├── layout/<br>
├── middleware/<br>
├── pages/<br>
├── api/<br>
├── App.jsx<br>
├── main.jsx<br>
└── theme.js

## Setup Instructions

- Clone the repository and navigate to both `frontend/` and `backend/` directories to set up both parts.

## Running the Application

- Ensure the backend is running by starting the server in `backend/`.
- Start the frontend app using `npm run dev` in `frontend/`.

This project is designed to scale efficiently and securely with role-based access control and multi-tenant capabilities.
