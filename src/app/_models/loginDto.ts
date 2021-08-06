export interface LoginInfo {
  accountName: string;
  password: string;
  rememberMe: boolean;
}
export interface UserToken {
  accessToken: string;
  refreshToken: string;
}
export interface UserInfo {
  givenName: string;
  email: string;
  phoneNumber: string;
  role: string;
  address: string;
  profileFicture: string;
  gender: number;
  lockoutEnabled: boolean;
}
