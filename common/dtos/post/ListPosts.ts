import { Post } from "@prisma/client";

export interface ListPostsResponse {
    posts: Post[];
    cursor: number;
}