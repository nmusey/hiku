import { Post } from "@prisma/client";
import { Author, Snappers } from "../../types/PostTypes";

export interface UnsnapRequest {
    postId: number;
}

export interface UnsnapResponse {
    post: Post & Author & Snappers;
}