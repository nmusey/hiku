import React from "react";
import { Card } from "antd";
import { AuthenticatedLayout } from "../components/layouts/AuthenticatedLayout";

export const PostListPage = (): JSX.Element => (
    <AuthenticatedLayout>
        <Card title="Example post">This is a post</Card>
    </AuthenticatedLayout>
);