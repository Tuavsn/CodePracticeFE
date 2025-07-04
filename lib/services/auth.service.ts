import { User } from "@/types/user";
import { apiClient, ApiError, ValidationError } from "../api/api-client";
import { API_CONFIG } from "../api/api-config";
import { z } from 'zod';

export const LoginRequestSchema = z.object({
  username: z.string()
    .min(10, 'Username must be at least 10 characters long')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only container letters, numbers, underscores and hyphens')
    .trim(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
})

export const LoginResponseSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email format'),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const RegisterRequestSchema = z.object({
  username: z.string()
    .min(10, 'Username must be at least 10 characters long')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only container letters, numbers, underscores and hyphens')
    .trim(),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
})

export const RegistResponseSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email format'),
  accessToken: z.string().nullable(),
  refreshToken: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegistResponse = z.infer<typeof RegistResponseSchema>;

export const AuthService = {
  login: async (request: LoginRequest) => {
    try {
      const validatedRequest = LoginRequestSchema.parse(request);
      const response = await apiClient.post<LoginResponse>(`${API_CONFIG.API_END_POINT.AUTH}/login`, validatedRequest);
      return LoginResponseSchema.parse(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid login data: ' + error.errors.map(e => e.message).join(', '));
      }
      if (error instanceof ApiError) {
        if (error.status === 401) {
          throw new AuthenticationError('Invalid username or password');
        }
        throw error;
      }
      throw new ApiError('Auth Failed', 400, 'LOGIN_ERROR', error)
    }
  },
  regist: async (request: RegisterRequest) => {
    try {

    } catch (error) {

    }
  },
  logout: async () => {
    try {

    } catch (error) {

    }
  }
}