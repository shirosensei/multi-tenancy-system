import express, { Application, Request, Response } from "express";
import postRouter from './routes/post';
import tenantRouter from './routes/tenant';
import rateLimit from 'express-rate-limit';
import  tenantResolver  from './middleware/tenantResolver';
import tenantContext from './middleware/tenantContext'; // Ensure this path is correct or create the module if it doesn't exist

const app: Application = express();

app.use(express.json());


export const tenantRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each tenant to 100 requests per window
  message: 'Too many requests from this tenant'
});


// Tenant Resolver for header based tenant resolution 
app.use(tenantResolver); 

// Middleware to set Prisma context
app.use(tenantContext);

// Rate Limiter
app.use(tenantRateLimiter);

// Routes
app.use('/posts', postRouter);
app.use('/tenants', tenantRouter);

// Error handler 
app.use((err: Error, req: Request, res: Response) => {
    res.status(500).json({ error: 'Internal server error' });
  });


const port = process.env.PORT || 3000;
app.listen(port, () =>  console.log(`Sever is running on port ${port}, Better catch it!`));