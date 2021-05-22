import { UserInfo } from "../../types/UserInfo";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse extends UserInfo {}