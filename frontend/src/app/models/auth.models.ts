export interface RegisterReq {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    agreeToTerms: boolean;
}

export interface RegisterRes {
    token: string;
}

export interface LoginReq {
    email: string;
    password: string;
}

export interface LoginRes {
    token: string;
    user: User;
}

export interface PasswordResetReq {
    email: string;
}

export interface PasswordResetRes {
    message: string;
}

export interface ResetPasswordData {
    token: string;
    password: string;
    password_confirmation: string;
}

export interface ResetPasswordDataRes {
    message: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_pic?: string;
    about: string;
    country: string;
    user_type: string;
    birth: Date;
    gender: string;
    created_at?: string;
    subscribers: number;
}
export interface Message {
  id: number;
  user_id: number;
  content: string;
  created_at?: string;
}
