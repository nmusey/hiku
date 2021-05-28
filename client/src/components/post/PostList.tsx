import React, { useEffect, useState } from "react";
import { List, Row } from "antd";
import { getJSON } from "../../utils/fetch.utils";
import { Endpoints } from "../../../../common/constants/Endpoints";
import { ListPostsResponse } from "../../../../common/dtos/post/ListPosts";
import { PostListItem } from "./PostListItem";
import { PostInfo } from "../../../../common/types/PostTypes";
import { LoadMore } from "../ui/LoadMore";
import { readJWT } from "../../utils/jwt.utils";



export const PostList = (): JSX.Element => {
    const ALL_POSTS_LOADED = 0;

    const [isLoading, setIsLoading] = useState(false);
    const [loadedPosts, setLoadedPosts] = useState<PostInfo[]>([]);
    const [cursor, setCursor] = useState(1);

    const userId = readJWT()?.id;

    async function loadPosts(): Promise<void> {
        if (cursor === ALL_POSTS_LOADED || isLoading) {
            return;
        }

        setIsLoading(true);

        const response = await getJSON(Endpoints.ListPosts, { cursor });
        const responseBody = await response.json() as ListPostsResponse;

        setCursor(responseBody.cursor);
        setLoadedPosts([...loadedPosts, ...responseBody.posts]);
        setIsLoading(false);
    }

    useEffect(() => {
        loadPosts();
    }, []);

    if (!userId) {
        return <></>;
    }

    return !isLoading && loadedPosts.length === ALL_POSTS_LOADED ? 
        <Row justify="center" className="fill">There are no haikus to show. Try following somebody to see their posts.</Row> :
        (
                <List
                    dataSource={loadedPosts} 
                    loadMore={ cursor !== ALL_POSTS_LOADED && <Row justify="center"><LoadMore loadMore={loadPosts} /></Row>}
                    renderItem={(post) => <PostListItem post={post} userId={userId}/>}
                    loading={isLoading}
                    className="fill-horizontal"
                />
        );
};