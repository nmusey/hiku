import React from "react";
import { UnauthenticatedLayout } from "../../components/layouts/UnauthenticatedLayout";
import { Card } from "antd";
import { useQueryParams } from "../../hooks/useQueryParams";
import { ConfirmRegistration } from "../../components/auth/ConfirmRegistration";

export const ConfirmRegistrationPage = (): JSX.Element => {
    const username = useQueryParams("username");
    const token = useQueryParams("token");

    return (
        <UnauthenticatedLayout>
            <Card hoverable className="fill" title="Confirm registration">
                <ConfirmRegistration username={username} token={token} />
            </Card>
        </UnauthenticatedLayout>
    );
};