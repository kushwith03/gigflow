import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: '30d', // Configurable if needed, keeping it simple for now
  });
};
