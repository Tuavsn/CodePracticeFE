import { BaseObject } from "./global";

export interface User extends BaseObject {
  username: string;
  role: (keyof typeof ROLE);
  email: string;
  avatar: string;
  phone: string;
  address: string;
  achievement: (keyof typeof ACHIEVEMENT);
  totalSubmissionPoint: number;
  status: (keyof typeof ACCOUNT_STATUS);
  authProvider: (keyof typeof ACCOUNT_PROVIDER);
  devices: {
    info: string;
    ip: string;
    expireAt: Date;
    lastLoginTime: Date;
  }[];
  bio: string;
}

export const ACCOUNT_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  BLOCK: 'Block',
}

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female'
}

export const ACHIEVEMENT = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  EXPERT: 'expert'
}

export const ROLE = {
  USER: 'user',
  ADMIN: 'admin'
}

export const ACCOUNT_PROVIDER = {
  LOCAL: 'local',
  GOOGLE: 'google',
  BOTH: 'both'
}
