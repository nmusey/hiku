import { PostWithAuthor } from "../../types/PostWithAuthor";

export interface ListPostsResponse {
    posts: PostWithAuthor[];
    cursor: number;
}