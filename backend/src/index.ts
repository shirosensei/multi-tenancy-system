import express, { Application, Request, Response } from "express";
import postRouter from './routes/post';
import tenantRouter from './routes/tenant';


const app: Application = express();

app.use(express.json());


// Routes
app.use('/posts', postRouter);
app.use('/tenants', tenantRouter);

// Error handler 
app.use((err: Error, req: Request, res: Response) => {
    res.status(500).json({ error: 'Internal server error' });
  });


const port = process.env.PORT || 3000;
app.listen(port, () =>  console.log(`Sever is running on port ${port}, Better catch it!`));