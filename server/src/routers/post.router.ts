import { Request, Response, Router } from "express";
import { Endpoints } from "../../../common/constants/Endpoints.js";
import { CreatePostRequest } from "../../../common/dtos/post/CreatePost.js";
import { ListPostsResponse } from "../../../common/dtos/post/ListPosts.js";
import { ListUserPostsResponse } from "../../../common/dtos/post/ListUserPosts.js";
import { SnapRequest, SnapResponse } from "../../../common/dtos/post/Snap.js";
import { UnsnapRequest, UnsnapResponse } from "../../../common/dtos/post/Unsnap.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { createPost, findAllPostsByFollowedUserIds, findAllPostsByUser, findPostById, snapPost, unsnapPost } from "../utils/database/post.utils.js";
import { findFollowedIds, findUserById } from "../utils/database/user.utils.js";
import { getUserFromJWT } from "../utils/jwt.utils.js";
import { mapPostToPostInfo, PostWithConnectedData } from "../utils/post.utils.js";
import { createPostValidators } from "../validators/post/createPost.validators.js";
import { listPostsValidators } from "../validators/post/listPosts.validators.js";
import { listUserPostsValidators } from "../validators/post/listUserPosts.validator.js";
import { snapValidators } from "../validators/post/snap.validators.js";
import { unsnapValidators } from "../validators/post/unsnap.validators.js";

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

    const allFollowedIds = await findFollowedIds(userId);
    const posts = await findAllPostsByFollowedUserIds(userId, allFollowedIds, parsedCursor, POSTS_PER_REQUEST);
    
    const responseBody: ListPostsResponse = {
        posts,
        cursor: posts[POSTS_PER_REQUEST - 1]?.id || 0
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


    const posts = await findAllPostsByUser(userId, username, parsedCursor, POSTS_PER_REQUEST);

    const responseBody = {
        posts, 
        cursor: posts[POSTS_PER_REQUEST - 1]?.id || 0 
    } as ListUserPostsResponse;
    return res.json(responseBody);
});

postRouter.post("/" + Endpoints.CreatePost.action, createPostValidators, validationMiddleware, async (req: Request, res: Response) => {
    const userId = getUserFromJWT(req)!.id;

    const { firstLine, secondLine, thirdLine } = req.body as CreatePostRequest;

    createPost(userId, firstLine, secondLine, thirdLine);

    const responseBody = {};
    res.json(responseBody);
});

postRouter.post("/" + Endpoints.Snap.action, snapValidators, validationMiddleware, async (req: Request, res: Response) => {
    const { postId } = req.body as SnapRequest;
    const userId = getUserFromJWT(req)!.id;
    const user = await findUserById(userId);
    const initialPost = await findPostById(postId);

    if (!initialPost) {
        return res.status(404).send({ errors: ["Please snap an existing post."] })
    }

    const updatedPost = await snapPost(postId, user);

    const post = mapPostToPostInfo(updatedPost as PostWithConnectedData, userId)
    const responseBody: SnapResponse = { post };
    return res.json(responseBody);
});

postRouter.post("/" + Endpoints.Unsnap.action, unsnapValidators, validationMiddleware, async (req: Request, res: Response) => {
    const { postId } = req.body as UnsnapRequest;
    const userId = getUserFromJWT(req)!.id;
    const user = await findUserById(userId);
    const initialPost = await findPostById(postId);

    if (!initialPost) {
        return res.status(404).send({ errors: ["Please unsnap an existing post."] })
    }

    const updatedPost = await unsnapPost(postId, user);

    const post = mapPostToPostInfo(updatedPost as PostWithConnectedData, userId)
    const responseBody: UnsnapResponse = { post };
    return res.json(responseBody);
});