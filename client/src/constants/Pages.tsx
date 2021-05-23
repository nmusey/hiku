import React from "react";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { PostListPage } from "../pages/PostListPage";
import { RegisterSuccessPage } from "../pages/auth/RegisterSuccessPage";
import { ConfirmRegistrationPage } from "../pages/auth/ConfirmRegistrationPage";
import { LogoutPage } from "../pages/auth/LogoutPage";

export interface Page {
    name: string;
    route: string;
    component: React.ReactNode;
    authenticated: boolean;
}

export const Pages: Record<string, Page> = {
    Login:               { name: "Login",                route: "/auth/login",               component: <LoginPage />,               authenticated: false },
    Logout:              { name: "Logout",               route: "/auth/logout",              component: <LogoutPage />,              authenticated: false},
    Register:            { name: "Register",             route: "/auth/register",            component: <RegisterPage />,            authenticated: false},
    RegisterSuccess:     { name: "Register Success",     route: "/auth/registerSuccess",     component: <RegisterSuccessPage />,     authenticated: false},
    ConfirmRegistration: { name: "Confirm Registration", route: "/auth/confirmRegistration", component: <ConfirmRegistrationPage />, authenticated: false},
    PostList:            { name: "Posts",                route: "/posts",                    component: <PostListPage />,            authenticated: true},
};