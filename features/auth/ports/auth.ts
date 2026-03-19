import { Profile, RegisterData } from "../models/auth";

export interface IAuthService {
  login(email: string, password: string): Promise<any>;
  register(data: RegisterData): Promise<{ success: boolean; error?: string }>;
  syncProfile(): Promise<void>;
  signOut(): Promise<void>;
}
