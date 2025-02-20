# multi-tenancy-system


A scalable multi-tenant SaaS system with MongoDB sharding and a tenant management dashboard. 

## Technologies

React
Express
Prisma

multi-tenancy-system/  
├── backend/  
│   ├── src/  
│   │   ├── middleware/          # Tenant resolution, auth, etc.  
│   │   ├── controllers/        # API logic (tenant CRUD, metrics)  
│   │   ├── services/           # Business logic (sharding, caching)  
│   │   ├── utils/              # Helpers (database connectors, Redis)  
│   │   ├── prisma/             # Prisma schema, migrations  
│   │   └── app.js              # Express app setup  
│   ├── config/                 # Environment variables  
│   ├── tests/                  # Integration/unit tests  
│   ├── .env.example            # Template for environment variables  
│   └── package.json  
│  
├── frontend/  
│   ├── public/  
│   ├── src/  
│   │   ├── components/         # Reusable UI (TenantList, MetricsChart)  
│   │   ├── pages/              # Dashboard, TenantCreate, TenantEdit  
│   │   ├── services/           # API calls to backend  
│   │   ├── contexts/           # Auth/tenant context (if using React)  
│   │   ├── assets/             # Images, styles  
│   │   └── App.js              # Main app component  
│   ├── tests/                  # UI unit/integration tests  
│   └── package.json  
│  
├── .github/  
│   └── workflows/              # CI/CD pipelines (see below)  
│  
├── docker/                     # Dockerfiles for backend/frontend  
├── docs/                       # API docs, architecture diagrams  
├── .gitignore  
├── README.md                   # Project overview, setup instructions  
└── docker-compose.yml          # Local dev setup (optional)  