import React from "react";
import { UnauthenticatedLayout } from "../components/layouts/UnauthenticatedLayout";
import { Card } from "antd";

export const LoginPage = (): JSX.Element => (
    <UnauthenticatedLayout>
        <Card hoverable className="fill" title="Login page">This is a filler card</Card>
    </UnauthenticatedLayout>
);