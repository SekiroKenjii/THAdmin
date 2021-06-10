export interface Role {
  name: string;
  description: string;
}
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  currentPassword: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  gender: string;
  subRole: string;
  lockoutEnabled: boolean;
}
export interface UserVM {
  user: User;
  roles: string;
}
export interface CreateUser {
  username: string,
  email: string,
  phoneNumber: string,
  gender: number,
  password: string,
  role: string;
  subRole: string;
}
