import { PostInfo } from "../../types/PostTypes";

export interface UnsnapRequest {
    postId: number;
}

export interface UnsnapResponse {
    post: PostInfo;
}