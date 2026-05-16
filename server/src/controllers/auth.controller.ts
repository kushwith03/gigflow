import { Request, Response } from 'express';
import { asyncHandler } from '../utils/errors';
import { sendResponse } from '../utils/response';
import * as authService from '../services/auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: 'User registered successfully',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  sendResponse(res, {
    message: 'Login successful',
    data: result,
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  sendResponse(res, {
    data: {
      user: {
        id: req.user?._id,
        name: req.user?.name,
        email: req.user?.email,
        role: req.user?.role,
      },
    },
  });
});
