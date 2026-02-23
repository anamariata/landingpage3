// Tipos de autenticación y roles del sistema
import type { User, Session } from "@supabase/supabase-js";

export type AppRole = "admin" | "doctor";

export interface AuthState {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}
