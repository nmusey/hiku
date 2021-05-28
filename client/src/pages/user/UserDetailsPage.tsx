import { Row } from "antd";
import React from "react";
import { useParams } from "react-router";
import { AuthenticatedLayout } from "../../components/layouts/AuthenticatedLayout";
import { UserPostList } from "../../components/post/UserPostList";
import { UserDetail } from "../../components/user/UserDetail";

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