import Prisma from "@prisma/client";
import { Request, Response, Router } from "express";
import { Endpoints } from "../../../common/constants/Endpoints.js";
import { CreatePostRequest } from "../../../common/dtos/post/CreatePost.js";
import { ListPostsResponse } from "../../../common/dtos/post/ListPosts.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { getUserFromJWT } from "../utils/jwt.utils.js";
import { createPostValidators } from "../validators/post/CreatePost.js";
import { listPostsValidators } from "../validators/post/ListPosts.js";

const prisma = new Prisma.PrismaClient();

export const postRouter = Router();

postRouter.use(authMiddleware);

postRouter.get("/" + Endpoints.ListPosts.action, listPostsValidators, validationMiddleware, async (req: Request, res: Response) => {
    const POSTS_PER_REQUEST = 2;
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
    console.log(req.body);

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