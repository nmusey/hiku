import { Post } from "@prisma/client";
import { Author, Snappers } from "../../types/PostTypes";

export interface SnapRequest {
    postId: number;
}

export interface SnapResponse {
    post: Post & Author & Snappers;
}