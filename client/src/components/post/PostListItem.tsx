import React, { useState } from "react";
import { Button, Card, List, Row, Space, Typography } from "antd";
import { PostInfo } from "../../../../common/types/PostTypes";
import { RequestMethods, useRequest } from "../../hooks/useRequest";
import { SnapRequest, SnapResponse } from "../../../../common/dtos/post/Snap";
import { Endpoints } from "../../../../common/constants/Endpoints";
import { UnsnapRequest, UnsnapResponse } from "../../../../common/dtos/post/Unsnap";
import { ErrorList } from "../ui/ErrorList";

interface Props {
    post: PostInfo;
    userId: number;
}

export const PostListItem = (props: Props): JSX.Element => {
    const [ isSnapLoading, snapErrors, snapInitiator ] = useRequest<SnapRequest, SnapResponse>(Endpoints.Snap, RequestMethods.Post);
    const [ isUnsnapLoading, unsnapErrors, unsnapInitiator ] = useRequest<UnsnapRequest, UnsnapResponse>(Endpoints.Unsnap, RequestMethods.Post);

    const [ post, setPost ] = useState(props.post);
    const [ isHovering, setIsHovering ] = useState(false);
    const [ hasSnapped, setHasSnapped ] = useState(props.post.doesUserSnap);

    async function handleClick(): Promise<void> {
        const requestBody = {
            postId: props.post.id
        };

        if (hasSnapped) {
            const { responseBody } = await unsnapInitiator(requestBody);
            setPost((responseBody as UnsnapResponse).post);
            setHasSnapped(false);
        } else {
            const { responseBody } = await snapInitiator(requestBody);
            setPost((responseBody as SnapResponse).post);
            setHasSnapped(true);
        }
    }

    return (
        <List.Item className="center-horizontal fill-horizontal" >
            <Card 
                hoverable 
                className="haiku-display-item"
                onMouseEnter={() => setIsHovering(true)} 
                onMouseLeave={() => setIsHovering(false)}
            >
                <Space direction="vertical" size="middle">
                    <ErrorList errors={snapErrors.concat(unsnapErrors)} />

                    <Row justify="center" wrap className="fill-horizontal">
                        <Typography.Text strong>{ post.firstLine }</Typography.Text>
                    </Row>
                    <Row justify="center" wrap className="fill-horizontal">
                        <Typography.Text strong>{ post.firstLine }</Typography.Text>
                    </Row>
                    <Row justify="center" wrap className="fill-horizontal">
                        <Typography.Text strong>{ post.firstLine }</Typography.Text>
                    </Row>
                    
                    {
                        isHovering &&
                        <>
                            <Row justify="center" wrap>
                                <Typography.Text type="secondary">
                                    - { post.author }
                                </Typography.Text>
                            </Row>
                            <Row justify="center" wrap>
                                <Button 
                                    loading={isSnapLoading || isUnsnapLoading}
                                    onClick={handleClick}
                                    type={hasSnapped ? "primary" : "default"}
                                >
                                        &#128076;
                                </Button>
                            </Row>
                            {
                                props.post.snappers !== undefined && 
                                <Row justify="center" className="fill-horizontal">
                                    <Typography.Text>{ post.snappers } snaps</Typography.Text>
                                </Row>
                            }
                        </>
                    }
                </Space>
            </Card>
        </List.Item>
    );
};