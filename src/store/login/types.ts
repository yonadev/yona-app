export interface LoginState {
  pinCode: number | null;
  loginAttempts: number | null;
  locked_timer: number | null;
}