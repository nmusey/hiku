import { PostInfo } from "../../types/PostTypes";

export interface ListPostsResponse {
    posts: PostInfo[];
    cursor: number;
}