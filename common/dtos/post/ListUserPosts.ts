import { PostInfo } from "../../types/PostTypes";

export interface ListUserPostsResponse {
    posts: PostInfo[];
    cursor: number;
}