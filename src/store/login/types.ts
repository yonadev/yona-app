export interface LoginState {
  isRegistered: boolean;
  isLocked: boolean;
  isLoggedIn: boolean;
  pinIsReset: boolean;
  pinIsSet: boolean;
  pinCode: number | null;
  loginAttempts: number;
  locked_timer: number | null;
  lastRoute: {
    name: string;
    params: {};
    query: {};
  } | null;
}
