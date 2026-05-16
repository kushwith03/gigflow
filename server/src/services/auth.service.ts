import User from '../models/user.model.js';
import { AppError } from '../utils/errors.js';
import { generateToken } from '../utils/jwt.js';
import type { IUser } from '../types/user.types.js';

export const registerUser = async (userData: Partial<IUser>) => {
  const { email } = userData;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  const user = await User.create(userData);
  const token = generateToken(user._id as unknown as string);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const loginUser = async (credentials: Pick<IUser, 'email' | 'password'>) => {
  const { email, password } = credentials;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user._id as unknown as string);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};
