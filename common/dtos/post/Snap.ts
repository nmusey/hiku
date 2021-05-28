import { PostInfo } from "../../types/PostTypes";

export interface SnapRequest {
    postId: number;
}

export interface SnapResponse {
    post: PostInfo;
}