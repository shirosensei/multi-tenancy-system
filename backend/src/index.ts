import express, { Application, Request, Response } from "express";
import errorHandler from './middleware/errorHandler';
import postRouter from './routes/post';
import tenantRouter from './routes/tenant';
import userRouter from './routes/user';
import rateLimit from 'express-rate-limit';
import  tenantResolver  from './middleware/tenantResolver';
import tenantContext from './middleware/tenantContext'; 
import logger from './utils/logger'; 
import cors from 'cors';
import { authenticate } from './middleware/authenticate'; 

// import proxy_url = meta.import.meta.env.VITE_API_URL;

const app: Application = express();

// CORS configuration
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  })
);

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Log incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});



// Tenant Resolver for header based tenant resolution 
app.use(tenantResolver); 

// Middleware to set Prisma context
app.use(tenantContext);


// Rate Limit
export const tenantRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each tenant to 100 requests per window
  message: 'Too many requests from this tenant'
});

// Rate Limiter
app.use(tenantRateLimiter);

// Routes

app.use('/', tenantRouter);
app.use('/auth', userRouter);
app.use('/auth', postRouter);

// Error handler 
app.use(errorHandler)


const port = process.env.PORT || 3000;
app.listen(port, () =>  console.log(`Sever is running on port ${port}, Better catch it!`));