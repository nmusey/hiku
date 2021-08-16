import React from "react";
import { UnauthenticatedLayout } from "../../deprecated_components/layouts/UnauthenticatedLayout";
import { Card } from "antd";
import { LoginForm } from "../../deprecated_components/auth/LoginForm";

export const LoginPage = (): JSX.Element => (
    <UnauthenticatedLayout>
        <Card hoverable className="fill" title="Login">
            <LoginForm />
        </Card>
    </UnauthenticatedLayout>
);