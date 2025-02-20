import { Request, Response } from "express";
import prisma from "../utils/prisma"; // Local Prisma client instance
import { TenantRequest } from "../middleware/tenantResolver";

export const createPost = async (
  req: TenantRequest,
  res: Response<
    { id: string; title: string; tenantId: string } | { error: string }
  >
): Promise<void> => {
  const { title } = req.body;

  try {
    const post = await prisma.post.create({
      data: { title, tenantId: req.tenant!.subdomain },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getPosts = async (
  req: TenantRequest,
  res: Response<Array<{ id: string; title: string }> | { error: string }>
) => {
  try {
    const posts = await prisma.post.findMany({
      where: { tenantId: req.tenant!.subdomain },
      select: { id: true, title: true },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      error: "Faied to fetch posts",
    });
  }
};
