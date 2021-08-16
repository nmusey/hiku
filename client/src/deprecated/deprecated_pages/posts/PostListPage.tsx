import React from "react";
import { AuthenticatedLayout } from "../../deprecated_components/layouts/AuthenticatedLayout";
import { PostList } from "../../deprecated_components/post/PostList";

export const PostListPage = (): JSX.Element => (
    <AuthenticatedLayout>
        <PostList />
    </AuthenticatedLayout>
);