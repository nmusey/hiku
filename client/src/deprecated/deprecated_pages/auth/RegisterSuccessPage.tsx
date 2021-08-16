import React from "react";
import { UnauthenticatedLayout } from "../../deprecated_components/layouts/UnauthenticatedLayout";
import { RegisterSuccess } from "../../deprecated_components/auth/RegisterSuccess";

export const RegisterSuccessPage = (): JSX.Element => {
    return (
        <UnauthenticatedLayout>
            <RegisterSuccess />
        </UnauthenticatedLayout>
    );
};