import Prisma from "@prisma/client";
import { Request, Response, Router } from "express";
import { Endpoints } from "../../../common/constants/Endpoints.js";
import { SearchRequest, SearchResponse } from "../../../common/dtos/user/Search.js";
import { UserInfo } from "../../../common/types/UserInfo.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { getUserFromJWT } from "../utils/jwt.utils.js";
import { searchValidators } from "../validators/user/search.validator.js";

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
            followers: user.followers.length,
            doesCurrentUserFollow: !!user.followers.find(user => user.id == searcherId)
        });
    });

    const responseBody: SearchResponse = {
        users,
        cursor: searchResults[USERS_PER_SEARCH - 1]?.id || 0
    };

    res.json(responseBody);
});