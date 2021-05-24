import Prisma from "@prisma/client";
import { Request, Response, Router } from "express";
import { Endpoints } from "../../../common/constants/Endpoints.js";
import { CreatePostRequest } from "../../../common/dtos/post/CreatePost.js";
import { ListPostsResponse } from "../../../common/dtos/post/ListPosts.js";
import { SnapRequest, SnapResponse } from "../../../common/dtos/post/Snap.js";
import { UnsnapRequest, UnsnapResponse } from "../../../common/dtos/post/Unsnap.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { getUserFromJWT } from "../utils/jwt.utils.js";
import { createPostValidators } from "../validators/post/createPost.validators.js";
import { listPostsValidators } from "../validators/post/listPosts.validators.js";
import { snapValidators } from "../validators/post/snap.validators.js";
import { unsnapValidators } from "../validators/post/unsnap.validators.js";

const prisma = new Prisma.PrismaClient();

export const postRouter = Router();

postRouter.use(authMiddleware);

postRouter.get("/" + Endpoints.ListPosts.action, listPostsValidators, validationMiddleware, async (req: Request, res: Response) => {
    const POSTS_PER_REQUEST = 5;
    const userId = getUserFromJWT(req)!.id;

    const cursor = parseInt(req.query.cursor as string);

    const followingWithIds = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            following: {
                select: { id: true }
            }
        }
    });

    const followingIds = followingWithIds?.following.map(container => container.id);
    const posts = await prisma.post.findMany({
        include: {
            author: {
                select: {
                    username: true
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
        skip: cursor === 1 ? 0 : 1,
        cursor: cursor === 1 ? undefined : { id: cursor }
    });

    const responseBody: ListPostsResponse = {
        posts,
        cursor: posts[POSTS_PER_REQUEST - 1]?.id || -1
    };

    res.json(responseBody);
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

    res.sendStatus(200);
});

postRouter.post("/" + Endpoints.Snap.action, snapValidators, validationMiddleware, async (req: Request, res: Response) => {
    const { postId } = req.body as SnapRequest;
    const userId = getUserFromJWT(req)!.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
        res.status(404).send({ errors: ["Please snap an existing post."] })
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
                    username: true
                }
            },
            snappers: {
                select: {
                    id: true
                }
            }
        }
    });

    const responseBody: SnapResponse = { post: updatedPost };
    res.json(responseBody);
});

postRouter.post("/" + Endpoints.Unsnap.action, unsnapValidators, validationMiddleware, async (req: Request, res: Response) => {
    const { postId } = req.body as UnsnapRequest;
    const userId = getUserFromJWT(req)!.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
        res.status(404).send({ errors: ["Please unsnap an existing post."] })
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
                    username: true
                }
            },
            snappers: {
                select: {
                    id: true
                }
            }
        }
    });

    const responseBody: UnsnapResponse = { post: updatedPost };
    res.json(responseBody);
});