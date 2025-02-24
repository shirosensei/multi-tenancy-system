# Multi-Tenant Application System

A scalable multi-tenant system application utilizing role-based access control (RBAC), with MongoDB sharding and a tenant management dashboard. 


## Features
- Multi-Tenant Architecture
- RBAC middleware for secure role management
- MongoDB Sharding for scalability
- Tenant-specific dashboard and subscription management
- User activity tracking


## Technologies

React + Vite
Express
Prisma
Mongodb
Material UI
Tailwind CSS
Node.js
JWT

backend/
└── src/
    ├── controllers/
    │   ├── postController.js
    │   ├── tenantAuthController.js
    │   ├── tenantController.js
    │   └── userController.js
    ├── middlewares/
    │   ├── rbacMiddleware.js
    │   ├── identifyTenant.js
    │   ├── identifyTenantByDomain.js
    │   └── tenantMiddleware.js
    ├── prisma/
    │   └── schema.prisma
    ├── routes/
    │   ├── tenantRoutes.js
    │   └── userRoutes.js
    ├── types/
    │   └── tenantTypes.js
    ├── utils/
    │   └── helpers.js
    └── server.js


frontend/
└── src/
    ├── components/
    │   ├── subscription/
    │   ├── userActivity/
    │   ├── sidebar/
    │   ├── tenantForm/
    │   ├── tenantList/
    │   └── tenantMetrics/
    ├── context/
    │   ├── authContext.js
    │   ├── tenantContext.js
    │   └── userContext.js
    ├── layout/
    │   ├── Sidebar.js
    │   └── Navbar.js
    ├── middleware/
    │   └── authorize.js
    ├── pages/
    │   ├── dashboard.js
    │   ├── login.js
    │   ├── signup.js
    │   ├── subscription.js
    │   ├── tenantDetail.js
    │   ├── userActivityPage.js
    │   └── service.js
    ├── api/
    │   └── apiService.js
    ├── App.js
    ├── main.js
    └── theme.js

## Setup Instructions
- Clone the repository and navigate to both `frontend/` and `backend/` directories to set up both parts.
- Follow the setup instructions in both the `frontend/README.md` and `backend/README.md` for installation and configuration.

## Running the Application
- Ensure the backend is running by starting the server in `backend/`.
- Start the frontend app using `npm run dev` in `frontend/`.

This project is designed to scale efficiently and securely with role-based access control and multi-tenant capabilities.

