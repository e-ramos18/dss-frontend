export const enum Roles {
  RootAdmin = "RootAdmin",
  Admin = "Admin",
  User = "User",
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: Roles;
  isApproved?: boolean;
  createdAt?: string;
}

export interface IMovie {
  id?: string;
  title: string;
  description: string;
  cost: string;
  imageUrl: string;
  year: string;
  actors?: string[];
  reviews?: string[];
  createdAt?: string;
}

export interface IReview {
  id?: string;
  movieId: string;
  movie?: { title: string };
  userId: string;
  user?: { name: string };
  description: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

export interface IActor {
  id?: string;
  fname: string;
  lname: string;
  gender: string;
  imageUrl: string;
  createdAt?: string;
}

export interface APIResponse {
  data: null | IUser;
  error: string;
}
