import React from "react";
import { UnauthenticatedLayout } from "../components/layouts/UnauthenticatedLayout";
import { RegisterSuccess } from "../components/auth/RegisterSuccess";

export const RegisterSuccessPage = (): JSX.Element => {
    return (
        <UnauthenticatedLayout>
            <RegisterSuccess />
        </UnauthenticatedLayout>
    );
};