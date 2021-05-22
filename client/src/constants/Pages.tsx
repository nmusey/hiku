import React from "react";
import { LoginPage } from "../pages/LoginPage";

export interface Page {
    name: string;
    route: string;
    component: React.ReactNode;
    authenticated: boolean;
}

export const Pages: {[key: string]: Page} = {
    Login: { name: "Login", route: "/auth/login", component: <LoginPage />, authenticated: false },
    Logout: { name: "Logout", route: "/auth/logout", component: "Logout page", authenticated: false},
    Register: { name: "Register", route: "/auth/register", component: "Register page", authenticated: false},
    ConfirmRegistration: { name: "Confirm Registration", route: "/auth/confirmRegistration", component: "Confirm registration page", authenticated: false}
};