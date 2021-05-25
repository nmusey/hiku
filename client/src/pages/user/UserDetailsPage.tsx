import React from "react";
import { useParams } from "react-router";
import { AuthenticatedLayout } from "../../components/layouts/AuthenticatedLayout";
import { UserDetail } from "../../components/user/UserDetail";

interface Params {
    username: string;
}

export const UserDetailsPage = (): JSX.Element => {
    const { username } = useParams<Params>();

    return (
        <AuthenticatedLayout>
            <UserDetail username={username} />
        </AuthenticatedLayout>
    );
};