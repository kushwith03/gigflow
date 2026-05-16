import { Document, Model } from 'mongoose';

export type UserRole = 'admin' | 'sales';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
