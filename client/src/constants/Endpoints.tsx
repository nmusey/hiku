import { Controller } from "../../../common/constants/Controller";

export interface Endpoint {
    controller: Controller;
    action: string;
}

export const Endpoints: Record<string, Endpoint> = {
    Register: { controller: Controller.Auth, action: "register"}
};