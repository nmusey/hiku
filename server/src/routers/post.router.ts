import { PrismaClient } from ".prisma/client";
import { Request, Response, Router } from "express";
import { Endpoints } from "../../../common/constants/Endpoints";
import { ListPostsResponse } from "../../../common/dtos/post/ListPosts";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getUserFromJWT } from "../utils/jwt.utils";

const prisma = new PrismaClient();

export const postRouter = Router();

postRouter.use(authMiddleware);

postRouter.get("/" + Endpoints.ListPosts.action, async (req: Request, res: Response) => {
    const POSTS_PER_REQUEST = 10;
    const userId = getUserFromJWT(req).id;

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
        where: {
            authorId: { in: followingIds }
        },
        orderBy: { createdAt: "desc" },
        take: POSTS_PER_REQUEST,
        skip: cursor === 0 ? 0 : 1,
        cursor: { id: cursor }
    });

    const responseBody: ListPostsResponse = {
        posts,
        cursor: posts[POSTS_PER_REQUEST - 1]?.id || -1
    };

    res.json(responseBody);

});