import Prisma, { Post, User } from "@prisma/client";
import { PostInfo } from "../../../../common/types/PostTypes";
import { mapPostToPostInfo, PostWithConnectedData } from "../post.utils";

const prisma = new Prisma.PrismaClient();

interface PostWithAuthorAndSnappers extends Post {
    author: {
        id: number;
        username: string;
    };
    snappers: { 
        id: number 
    }[];
}

export const createPost = async (authorId: number, firstLine: string, secondLine: string, thirdLine: string): Promise<void> => {
    await prisma.post.create({
        data: {
            firstLine,
            secondLine,
            thirdLine,
            author: { 
                connect: { id: authorId }
            }
        }
    });
};

export const findPostById = async (id: number): Promise<Post> => {
    return await prisma.post.findUnique({ where: { id } });
};

export const findAllPostsByFollowedUserIds = async (userId: number, followedUserIds: number[], cursor: number, postsToFind: number): Promise<PostInfo[]> => {
    const allPosts = await prisma.post.findMany({
        include: {
            author: {
                select: {
                    username: true,
                    id: true
                }
            },
            snappers: {
                select: {
                    id: true
                }
            }
        },
        where: {
            authorId: { in: followedUserIds }
        },
        orderBy: { createdAt: "desc" },
        take: postsToFind,
        skip: cursor === 1 ? 0 : 1,
        cursor: cursor === 1 ? undefined : { id: cursor }
    });

    return allPosts.map(post => mapPostToPostInfo(post as PostWithConnectedData, userId));
};

export const findAllPostsByUser = async (requesterUserId: number, username: string, cursor: number, postsToFind: number): Promise<PostInfo[]> => {
    const allPosts = await prisma.post.findMany({
        include: {
            author: {
                select: {
                    username: true,
                    id: true
                }
            },
            snappers: {
                select: {
                    id: true
                }
            }
        },
        where: { 
            author: { username } 
        },
        orderBy: { createdAt: "desc" },
        take: postsToFind,
        skip: cursor === 1 ? 0 : 1,
        cursor: cursor === 1 ? undefined : { id: cursor }
    });

    return allPosts.map(post => mapPostToPostInfo(post as PostWithConnectedData, requesterUserId));
};

export const snapPost = async (postId: number, snapper: User): Promise<PostWithAuthorAndSnappers> => {
    return await prisma.post.update({
        where: { id: postId },
        data: {
            snappers: {
                connect: {
                    id: snapper!.id
                }
            }
        },
        include: {
            author: {
                select: {
                    username: true,
                    id: true
                }
            },
            snappers: {
                select: {
                    id: true
                }
            }
        }
    });
}

export const unsnapPost = async (postId: number, snapper: User): Promise<PostWithAuthorAndSnappers> => {
    return await prisma.post.update({
        where: { id: postId },
        data: {
            snappers: {
                disconnect: {
                    id: snapper!.id
                }
            }
        },
        include: {
            author: {
                select: {
                    username: true,
                    id: true
                }
            },
            snappers: {
                select: {
                    id: true
                }
            }
        }
    });
}