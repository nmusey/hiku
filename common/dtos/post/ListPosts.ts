import { Post } from "@prisma/client";
import { Author, Snappers } from "../../types/PostTypes";

export interface ListPostsResponse {
    posts: (Post & Author & Snappers)[];
    cursor: number;
}