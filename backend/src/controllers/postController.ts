import { TypedRequestBody, TypedRequestQuery, ApiResponse, PostResponse, GetPostsQuery } from '../types/express';
import { Response } from "express"
import logger from '../utils/logger';
import prisma from "../utils/prisma";


interface CreatePostRequestBody {
  title: string;
  content?: string;
}


export const createPost = async (
  req: TypedRequestBody<CreatePostRequestBody>,
  res: Response
): Promise<void> => {

  try {

    // Ensure tenant and tenant.domain exist
    if (!req.tenant?.id || !req.user?.id) {
      logger.warn("Tenant domain is missing")
      res.status(400).json({ error: 'Unauthorized' });
      return
    }

    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        tenantId: req.tenant.id,
        authorId: req.user.id,
      },
      include: {
        author: true,
        tenant: true
      }
    });

    res.status(201).json({
      id: post.id,
      title: post.title,
      content: post.content,
      author: req.user.username,
      tenant: req.tenant.domain
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getPosts = async (
  req: TypedRequestQuery<GetPostsQuery>, res: Response<ApiResponse<PostResponse []>>
): Promise<void> => {
  try {

    if (!req.tenant?.id) {
       res.status(403).json({ success: false,
        error: 'Tenant context required'  });
        return;
    }

    

    // const posts = await prisma.post.findMany({
    //   where: { tenantId: req.tenant.id },
    //   select: {
    //     id: true,
    //     title: true,
    //     createdAt: true,
    //     author: { select: { username: true } }
    //   },
    //   orderBy: { createdAt: 'desc' }
    // });
    // res.status(200).json(posts);

    // Pagination and filtering
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const search = req.query.search || '';

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          tenantId: req.tenant.id,
          title: { contains: search, mode: 'insensitive' }
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          author: { select: { username: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.post.count({
        where: {
          tenantId: req.tenant.id,
          title: { contains: search, mode: 'insensitive' }
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total
      }
    });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts'
    });
  }
};