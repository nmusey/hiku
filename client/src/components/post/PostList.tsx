import React, { useEffect, useState } from "react";
import { List, Row } from "antd";
import { Post } from "@prisma/client";
import { getJSON } from "../../utils/fetch.utils";
import { Endpoints } from "../../../../common/constants/Endpoints";
import { ListPostsResponse } from "../../../../common/dtos/post/ListPosts";
import { PostListItem } from "./PostListItem";
import { Author, Snappers } from "../../../../common/types/PostTypes";
import { LoadMore } from "../ui/LoadMore";
import { readJWT } from "../../utils/jwt.utils";

export const PostList = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState(false);
    const [allPostsLoaded, setAllPostsLoaded] = useState(false);
    const [loadedPosts, setLoadedPosts] = useState<(Post & Author & Snappers)[]>([]);
    const [cursor, setCursor] = useState(1);

    const userId = readJWT()?.id;

    async function loadPosts(): Promise<void> {
        if (allPostsLoaded || isLoading) {
            return;
        }

        setIsLoading(true);

        const response = await getJSON(Endpoints.ListPosts, { cursor });
        const responseBody = await response.json() as ListPostsResponse;

        setCursor(responseBody.cursor);
        setLoadedPosts([...loadedPosts, ...responseBody.posts]);
        setIsLoading(false);

        if (responseBody.cursor === -1) {
            setAllPostsLoaded(true);
        }
    }

    useEffect(() => {
        loadPosts();
    }, []);

    if (!userId) {
        return <></>;
    }

    return !isLoading && allPostsLoaded && loadedPosts.length === 0 ? 
        <Row justify="center" className="fill">There are no haikus to show. Try following somebody to see their posts.</Row> :
        (
                <List
                    dataSource={loadedPosts} 
                    loadMore={allPostsLoaded && <Row justify="center"><LoadMore loadMore={loadPosts} /></Row>}
                    renderItem={(post) => <PostListItem post={post} userId={userId}/>}
                    loading={isLoading}
                    className="fill-horizontal"
                />
        );
};