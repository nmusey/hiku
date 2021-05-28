import Prisma from "@prisma/client";
import { Request, Response, Router } from "express";
import { Endpoints } from "../../../common/constants/Endpoints.js";
import { CreatePostRequest } from "../../../common/dtos/post/CreatePost.js";
import { ListPostsResponse } from "../../../common/dtos/post/ListPosts.js";
import { ListUserPostsResponse } from "../../../common/dtos/post/ListUserPosts.js";
import { SnapRequest, SnapResponse } from "../../../common/dtos/post/Snap.js";
import { UnsnapRequest, UnsnapResponse } from "../../../common/dtos/post/Unsnap.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { getUserFromJWT } from "../utils/jwt.utils.js";
import { mapPostToPostInfo, PostWithConnectedData } from "../utils/post.utils.js";
import { createPostValidators } from "../validators/post/createPost.validators.js";
import { listPostsValidators } from "../validators/post/listPosts.validators.js";
import { listUserPostsValidators } from "../validators/post/listUserPosts.validator.js";
import { snapValidators } from "../validators/post/snap.validators.js";
import { unsnapValidators } from "../validators/post/unsnap.validators.js";

const prisma = new Prisma.PrismaClient();

export const postRouter = Router();

postRouter.use(authMiddleware);

const POSTS_PER_REQUEST = 6;

postRouter.get("/" + Endpoints.ListPosts.action, listPostsValidators, validationMiddleware, async (req: Request, res: Response) => {
    const userId = getUserFromJWT(req)!.id;

    let parsedCursor: number;
    try {
        parsedCursor = parseInt(req.query.cursor as string);
    } catch {
        return res.status(400).send({ errors: ["User id and cursor must be integers."] });
    }

    const followingWithIds = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            following: {
                select: { id: true }
            }
        }
    });

    const followingIds = followingWithIds?.following.map(container => container.id);
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
            authorId: { in: followingIds }
        },
        orderBy: { createdAt: "desc" },
        take: POSTS_PER_REQUEST,
        skip: parsedCursor === 1 ? 0 : 1,
        cursor: parsedCursor === 1 ? undefined : { id: parsedCursor }
    });

    const posts = allPosts.map(post => mapPostToPostInfo(post as PostWithConnectedData, userId));
    const responseBody: ListPostsResponse = {
        posts,
        cursor: allPosts[POSTS_PER_REQUEST - 1]?.id || 0
    };

    return res.json(responseBody);
});

postRouter.get("/" + Endpoints.ListUserPosts.action, listUserPostsValidators, validationMiddleware, async (req: Request, res: Response) => {
    const { username, cursor } = req.params;
    const userId = getUserFromJWT(req)!.id;

    let parsedCursor: number;
    try {
        parsedCursor = parseInt(cursor as string);
    } catch {
        return res.status(400).send({ errors: ["User id and cursor must be integers."] });
    }

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
        take: POSTS_PER_REQUEST,
        skip: parsedCursor === 1 ? 0 : 1,
        cursor: parsedCursor === 1 ? undefined : { id: parsedCursor }
    });

    const posts = allPosts.map(post => mapPostToPostInfo(post as PostWithConnectedData, userId));
    const responseBody = {
        posts, 
        cursor: posts[POSTS_PER_REQUEST - 1]?.id || 0 
    } as ListUserPostsResponse;
    return res.json(responseBody);
});

postRouter.post("/" + Endpoints.CreatePost.action, createPostValidators, validationMiddleware, async (req: Request, res: Response) => {
    const userId = getUserFromJWT(req)!.id;

    const { firstLine, secondLine, thirdLine } = req.body as CreatePostRequest;

    await prisma.post.create({
        data: {
            firstLine,
            secondLine,
            thirdLine,
            author: { 
                connect: { id: userId }
            }
        }
    });

    const responseBody = {};
    res.json(responseBody);
});

postRouter.post("/" + Endpoints.Snap.action, snapValidators, validationMiddleware, async (req: Request, res: Response) => {
    const { postId } = req.body as SnapRequest;
    const userId = getUserFromJWT(req)!.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const initialPost = await prisma.post.findUnique({ where: { id: postId } });

    if (!initialPost) {
        return res.status(404).send({ errors: ["Please snap an existing post."] })
    }

    const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
            snappers: {
                connect: {
                    id: user!.id
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

    const post = mapPostToPostInfo(updatedPost as PostWithConnectedData, userId)
    const responseBody: SnapResponse = { post };
    return res.json(responseBody);
});

postRouter.post("/" + Endpoints.Unsnap.action, unsnapValidators, validationMiddleware, async (req: Request, res: Response) => {
    const { postId } = req.body as UnsnapRequest;
    const userId = getUserFromJWT(req)!.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const initialPost = await prisma.post.findUnique({ where: { id: postId } });

    if (!initialPost) {
        return res.status(404).send({ errors: ["Please unsnap an existing post."] })
    }

    const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
            snappers: {
                disconnect: {
                    id: user!.id
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

    const post = mapPostToPostInfo(updatedPost as PostWithConnectedData, userId)
    const responseBody: UnsnapResponse = { post };
    return res.json(responseBody);
});