import { Request, Response } from "express";
import prisma from "../utils/prisma"; // Local Prisma client instance

export interface Tenant {
  tenant: string;
}

export const createPost = async (
  req: Request,
  res: Response<
    { id: string; title: string; tenantId: string } | { error: string }
  >
): Promise<void> => {
  const { title }: any = req.body;

  try {

    // Ensure tenant and tenant.domain exist
    if (!req.tenant || !req.tenant.domain) {
       res.status(400).json({ error: 'Tenant domain is missing' });
       return
    }

    const post = await prisma.post.create({
      data: { title, tenantId: req.tenant.domain },
      // data: { title, tenantId: req.tenant!.domain },
    });

  

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getPosts = async (
  req: Request,
  res: Response<Array<{ id: string; title: string }> | { error: string }>
) => {
  try {

      // Ensure tenant and tenant.domain exist
      if (!req.tenant || !req.tenant.domain) {
        res.status(400).json({ error: 'Tenant domain is missing' });
        return
     }

     
    const posts = await prisma.post.findMany({
      where: { tenantId: req.tenant!.domain },
      select: { id: true, title: true },
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      error: "Faied to fetch posts",
    });
  }
};