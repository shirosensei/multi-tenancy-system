import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import logger from "../utils/logger";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { TypedRequestBody, TypedRequestQuery, TypedRequestParams } from "../types/express";

export const authenticate = <T>(
  req: TypedRequestBody<T> | TypedRequestQuery<T> | TypedRequestParams<T>,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Unauthorized: Missing or invalid authorization header");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Unauthorized: Missing token");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token) as {
      name: string;
      createdAt: Date;
      updatedAt: Date;
      email: string; tenantId: string, domain: string;
    };
    req.tenant = {
      domain: decoded.domain,
      id: decoded.tenantId,
      name: decoded.name,
      email: decoded.email,
      createdAt: decoded.createdAt,
      updatedAt: decoded.updatedAt
    }

    // logger.info(
    //   `User authenticated: userId=${decoded.userId}, tenantId=${decoded.tenantId}`
    // );

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      logger.error("Token expired", { error });
      return res.status(401).json({ error: "Token expired" });
    } else if (error instanceof JsonWebTokenError) {
      logger.error("Invalid token", { error });
      return res.status(401).json({ error: "Invalid token" });
    } else {
      logger.error("Unathuorized", { error });
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
};
