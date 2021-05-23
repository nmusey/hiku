import React from "react";
import { AuthenticatedLayout } from "../../components/layouts/AuthenticatedLayout";
import { PostList } from "../../components/post/PostList";

export const PostListPage = (): JSX.Element => (
    <AuthenticatedLayout>
        <PostList />
    </AuthenticatedLayout>
);