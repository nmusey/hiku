import { UserInfo } from "../../types/UserInfo";

export interface ConfirmRegistrationRequest {
    username: string;
    token: string;
}

export interface ConfirmRegistrationResponse extends UserInfo {}