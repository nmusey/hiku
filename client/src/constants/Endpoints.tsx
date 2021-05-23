import { Controller } from "../../../common/constants/Controller";

export interface Endpoint {
    controller: Controller;
    action: string;
}

export const Endpoints: Record<string, Endpoint> = {
    Register: { controller: Controller.Auth, action: "register"},
    ConfirmRegistration: { controller: Controller.Auth, action: "confirmRegistration"},
    Login: {controller: Controller.Auth, action: "login"},
};