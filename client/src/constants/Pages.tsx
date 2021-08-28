import React from "react";
// import { LoginPage } from "../deprecated_pages/auth/LoginPage";
// import { RegisterPage } from "../deprecated_pages/auth/RegisterPage";
// import { PostListPage } from "../deprecated_pages/posts/PostListPage";
// import { RegisterSuccessPage } from "../deprecated_pages/auth/RegisterSuccessPage";
// import { ConfirmRegistrationPage } from "../deprecated_pages/auth/ConfirmRegistrationPage";
// import { LogoutPage } from "../deprecated_pages/auth/LogoutPage";
// import { UserDetailsPage } from "../deprecated_pages/user/UserDetailsPage";
// import { LandingPage } from "../deprecated_pages/LandingPage";

export interface Page {
    route: string;
    component: React.ReactNode;
}

export const Pages: Record<string, Page> = {
    // Landing:             { route: "/",                         component: <LandingPage />              },
    // Login:               { route: "/auth/login",               component: <LoginPage />,               },
    // Logout:              { route: "/auth/logout",              component: <LogoutPage />,              },
    // Register:            { route: "/auth/register",            component: <RegisterPage />,            },
    // RegisterSuccess:     { route: "/auth/registerSuccess",     component: <RegisterSuccessPage />,     },
    // ConfirmRegistration: { route: "/auth/confirmRegistration", component: <ConfirmRegistrationPage />, },
    // PostList:            { route: "/posts",                    component: <PostListPage />,            },
    // UserDetails:         { route: "/user/:username",           component: <UserDetailsPage />          }
};

export const HomePage = Pages.PostList;