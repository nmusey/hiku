import Prisma from "@prisma/client";
import { Request, Response, Router } from "express";
import { Endpoints } from "../../../common/constants/Endpoints.js";
import { SearchRequest, SearchResponse } from "../../../common/dtos/user/Search.js";
import { UserDetailResponse } from "../../../common/dtos/user/UserDetail.js";
import { UserInfo } from "../../../common/types/UserInfo.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { getUserFromJWT } from "../utils/jwt.utils.js";
import { searchValidators } from "../validators/user/search.validator.js";
import { userDetailsValidator } from "../validators/user/userDetails.validator.js";
import { followValidator } from "../validators/user/follow.validator.js";
import { unfollowValidator } from "../validators/user/unfollow.validator.js";
import { FollowRequest, FollowResponse } from "../../../common/dtos/user/Follow.js";

export const userRouter = Router();
userRouter.use(authMiddleware);

const prisma = new Prisma.PrismaClient();

userRouter.post("/" + Endpoints.Search.action, searchValidators, validationMiddleware, async (req: Request, res: Response) => {
    const USERS_PER_SEARCH = 10;

    const { searchTerm, cursor } = req.body as SearchRequest; 
    const searcherId = getUserFromJWT(req)!.id;

    const searchResults = await prisma.user.findMany({
        where: {
            username: {
                contains: searchTerm,
                mode: "insensitive"
            }
        },
        include: {
            followers: true
        },
        take: USERS_PER_SEARCH,
        cursor: cursor == 1 ? undefined : { id: cursor },
        skip: cursor == 1 ? 0 : 1
    });

    const users: UserInfo[] = searchResults.map(user => {
        return ({
            id: user.id,
            username: user.username,
            followers: user.followers.length - 1,
            doesCurrentUserFollow: !!user.followers.find(user => user.id == searcherId)
        });
    });

    const responseBody: SearchResponse = {
        users,
        cursor: searchResults[USERS_PER_SEARCH - 1]?.id || 0
    };

    res.json(responseBody);
});

userRouter.get("/" + Endpoints.UserDetails.action, userDetailsValidator, validationMiddleware, async (req: Request, res: Response) => {
    const { username } = req.params;
    const requesterId = getUserFromJWT(req)!.id;

    const user = await prisma.user.findUnique({
        where: { username },
        include: { 
            followers: true,
            following: true
        }
    });

    if (!user) {
        return res.status(404).json({ errors: ["User not found."] });
    }

    const responseBody: UserDetailResponse = {
        user: {
            id: user.id,
            username: user.username,
            followers: user.followers.length - 1,
            following: user.following.length - 1,
            doesCurrentUserFollow: user.followers.some(user => user.id === requesterId)
        }
    };

    return res.json(responseBody);
});

userRouter.post("/" + Endpoints.Follow.action, followValidator, validationMiddleware, async (req: Request, res: Response) => {
    const { userId } = req.body as FollowRequest;
    const requesterId = getUserFromJWT(req)!.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return res.status(404).json({ errors: ["No user found with that id."] });
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            followers: {
                connect: { id: requesterId }
            }
        }, 
        include: {
            followers: true
        }
    });

    const responseBody: FollowResponse = {
        followers: updatedUser.followers.length
    }

    return res.json(responseBody);
});

userRouter.post("/" + Endpoints.Unfollow.action, unfollowValidator, validationMiddleware, async (req: Request, res: Response) => {
    const { userId } = req.body as FollowRequest;
    const requesterId = getUserFromJWT(req)!.id;

    if (userId === requesterId) {
        return res.status(400).json({ errors: ["You cannot unfollow yourself."] });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return res.status(404).json({ errors: ["No user found with that id."] });
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            followers: {
                disconnect: { id: requesterId }
            }
        }, 
        include: {
            followers: true
        }
    });

    const responseBody: FollowResponse = {
        followers: updatedUser.followers.length
    }

    return res.json(responseBody);
});