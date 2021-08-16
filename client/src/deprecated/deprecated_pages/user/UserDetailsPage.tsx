import { Row } from "antd";
import React from "react";
import { useParams } from "react-router";
import { AuthenticatedLayout } from "../../deprecated_components/layouts/AuthenticatedLayout";
import { UserPostList } from "../../deprecated_components/post/UserPostList";
import { UserDetail } from "../../deprecated_components/user/UserDetail";

interface Params {
    username: string;
}

export const UserDetailsPage = (): JSX.Element => {
    const { username } = useParams<Params>();

    return (
        <AuthenticatedLayout>
            <div className="block fill">
                <Row className="fill-horizontal block">
                    <UserDetail username={username} />
                </Row>
                <Row className="fill-horizontal">
                    <UserPostList username={username} />
                </Row>
            </div>
        </AuthenticatedLayout>
    );
};