import React from "react";
import { UnauthenticatedLayout } from "../../deprecated_components/layouts/UnauthenticatedLayout";
import { Card } from "antd";
import { RegisterForm } from "../../deprecated_components/auth/RegisterForm";

export const RegisterPage = (): JSX.Element => (
    <UnauthenticatedLayout>
        <Card hoverable className="fill" title="Register">
            <RegisterForm />
        </Card>
    </UnauthenticatedLayout>
);