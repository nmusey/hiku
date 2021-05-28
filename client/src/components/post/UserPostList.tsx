import { List, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Endpoints } from "../../../../common/constants/Endpoints";
import { ListUserPostsResponse } from "../../../../common/dtos/post/ListUserPosts";
import { PostInfo } from "../../../../common/types/PostTypes";
import { getJSONWithParams } from "../../utils/fetch.utils";
import { readJWT } from "../../utils/jwt.utils";
import { LoadMore } from "../ui/LoadMore";
import { PostListItem } from "./PostListItem";

interface Props {
    username: string;
}

export const UserPostList = (props: Props): JSX.Element => {
    const ALL_POSTS_LOADED = 0;

    const [isLoading, setIsLoading] = useState(false);
    const [loadedPosts, setLoadedPosts] = useState<PostInfo[]>([]);
    const [cursor, setCursor] = useState(1);

    const userId = readJWT()!.id;

    async function loadPosts(): Promise<void> {
        if (cursor === ALL_POSTS_LOADED || isLoading) {
            return;
        }

        setIsLoading(true);

        const response = await getJSONWithParams(Endpoints.ListUserPosts, { 
            username: props.username, 
            cursor: cursor.toString()
        });
        const responseBody = await response.json() as ListUserPostsResponse;

        setCursor(responseBody.cursor);
        setLoadedPosts([...loadedPosts, ...responseBody.posts]);
        setIsLoading(false);
    }

    useEffect(() => {
        loadPosts();
    }, [ window.location.hash ]);

    useEffect(() => {
        setIsLoading(false);
        setLoadedPosts([]);
        setCursor(1);
    }, [ props.username ]);

    return (
        <Row justify="center" className="fill-horizontal">
            {
                !isLoading && loadedPosts.length === ALL_POSTS_LOADED ? 
                <Typography.Text className="center-horizontal">There are no haikus to show. Try following somebody to see their posts.</Typography.Text>:
                (
                    
                    <List
                        dataSource={loadedPosts} 
                        loadMore={cursor !== ALL_POSTS_LOADED && <Row justify="center"><LoadMore loadMore={loadPosts} /></Row>}
                        renderItem={(post) => <PostListItem post={post} userId={userId}/>}
                        loading={isLoading}
                        className="fill-horizontal"
                    />
                )
            }
        </Row>
    );
};