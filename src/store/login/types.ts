export interface LoginState {
  isRegistered: boolean;
  isLocked: boolean;
  isLoggedIn: boolean;
  pinCode: number | null;
  loginAttempts: number;
  locked_timer: number | null;
}