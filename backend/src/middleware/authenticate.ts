import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import logger from "../utils/logger";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { TypedRequestBody, TypedRequestQuery, TypedRequestParams, ApiResponse } from "../types/express";

export const authenticate = (
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction
)  => {
  const authHeader = req.headers.authorization;

  console.log('req.tenant:', req.tenant);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Unauthorized: Missing or invalid authorization header");
     res.status(401).json({ success: false, error: "Unauthorized" });
     return;
     
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Unauthorized: Missing token");
     res.status(401).json({ success: false, error: "Unauthorized" });
     return;
  }

  try {
    const decoded = verifyToken(token) as {
      tenantId: string;
      name: string;
      email: string; 
      domain: string;      
      createdAt: Date;
      updatedAt: Date;
    };

    console.log('JWT Payload:', decoded);


    req.tenant = {
      domain: decoded.domain,
      id: decoded.tenantId,
      name: decoded.name,
      email: decoded.email,
      createdAt: decoded.createdAt,
      updatedAt: decoded.updatedAt
    }

    logger.info(
      `User authenticated: userId=${decoded.tenantId}, tenantId=${decoded.tenantId}`
    );

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      logger.error("Token expired", { error });
       res.status(401).json({ success: false, error: "Token expired" });
    } else if (error instanceof JsonWebTokenError) {
      logger.error("Invalid token", { error });
       res.status(401).json({ success: false, error: "Invalid token" });
    } else {
      logger.error("Unathuorized", { error });
       res.status(401).json({ success: false, error: "Unauthorized" });
    }
  }
};
