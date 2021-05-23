import React, { useEffect, useState } from "react";
import { List, Row } from "antd";
import { Post } from "@prisma/client";
import { getJSON } from "../../utils/fetch.utils";
import { Endpoints } from "../../../../common/constants/Endpoints";
import { ListPostsResponse } from "../../../../common/dtos/post/ListPosts";
import { LoadMore } from "../ui/LoadMore";

export const PostList = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState(false);
    const [allPostsLoaded, setAllPostsLoaded] = useState(false);
    const [loadedPosts, setLoadedPosts] = useState<Post[]>([]);
    const [cursor, setCursor] = useState(1);

    async function loadPosts(): Promise<void> {
        if (allPostsLoaded) {
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

    return !isLoading && allPostsLoaded && loadedPosts.length === 0 ? 
        <Row justify="center" className="fill">There are no haikus to show. Try following somebody to see their posts.</Row> :
        (
            <List
                dataSource={loadedPosts} 
                loadMore={<LoadMore loadMore={loadPosts} />}
                loading={isLoading}
                className="fill-horizontal"
            />
        );
};