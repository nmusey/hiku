import React from "react";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { PostListPage } from "../pages/PostListPage";
import { RegisterSuccessPage } from "../pages/RegisterSuccessPage";

export interface Page {
    name: string;
    route: string;
    component: React.ReactNode;
    authenticated: boolean;
}

export const Pages: {[key: string]: Page} = {
    Login:               { name: "Login",                route: "/auth/login",               component: <LoginPage />,               authenticated: false },
    Logout:              { name: "Logout",               route: "/auth/logout",              component: "Logout page",               authenticated: false},
    Register:            { name: "Register",             route: "/auth/register",            component: <RegisterPage />,            authenticated: false},
    RegisterSuccess:     { name: "Register Success",     route: "/auth/registerSuccess",     component: <RegisterSuccessPage />,     authenticated: false},
    ConfirmRegistration: { name: "Confirm Registration", route: "/auth/confirmRegistration", component: "Confirm registration page", authenticated: false},
    PostList:            { name: "Posts",                route: "/posts",                    component: <PostListPage />,            authenticated: true},
};