// src/controllers/tenantController.ts
import { Request, Response } from 'express';
import { ApiResponse } from '../types/express';

export const getTenantData = (
  req: Request,
  res: Response<ApiResponse<{ tenantId: string; tenantDomain: string }>>
) => {
  try {
    if (!req.tenant) {
      return res.status(403).json({
        success: false,
        error: 'Tenant context required'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        tenantId: req.tenant.id,
        tenantDomain: req.tenant.domain
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tenant data'
    });
  }
};