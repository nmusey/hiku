import { Post, User } from "@prisma/client";
import { PostInfo } from "../../../common/types/PostTypes";

export interface PostWithConnectedData extends Post {
    author: User;
    snappers: User[];
}

export const mapPostToPostInfo = (post: PostWithConnectedData, userId: number): PostInfo => ({
    id: post.id,
    firstLine: post.firstLine,
    secondLine: post.secondLine,
    thirdLine: post.thirdLine,
    author: post.author.username,
    doesUserSnap: post.snappers.some(snapper => snapper.id === userId),
    snappers: post.author.id === userId ? post.snappers.length : undefined
});