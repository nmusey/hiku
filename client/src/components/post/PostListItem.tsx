import React, { useState } from "react";
import { Button, Card, List, Row, Typography } from "antd";
import { Post } from "@prisma/client";
import { Author, Snappers } from "../../../../common/types/PostTypes";
import { RequestMethods, useRequest } from "../../hooks/useRequest";
import { SnapRequest, SnapResponse } from "../../../../common/dtos/post/Snap";
import { Endpoints } from "../../../../common/constants/Endpoints";
import { UnsnapRequest, UnsnapResponse } from "../../../../common/dtos/post/Unsnap";
import { ErrorList } from "../ui/ErrorList";

interface Props {
    post: Post & Author & Snappers;
    userId: number;
}

export const PostListItem = (props: Props): JSX.Element => {
    const [ isSnapLoading, snapErrors, snapInitiator ] = useRequest<SnapRequest, SnapResponse>(Endpoints.Snap, RequestMethods.Post);
    const [ isUnsnapLoading, unsnapErrors, unsnapInitiator ] = useRequest<UnsnapRequest, UnsnapResponse>(Endpoints.Unsnap, RequestMethods.Post);

    const [ isHovering, setIsHovering ] = useState(false);
    const [ hasSnapped, setHasSnapped ] = useState(props.post.snappers.some(snapper => snapper.id == props.userId));
    

    async function handleClick(): Promise<void> {
        const requestBody = {
            postId: props.post.id
        };

        if (hasSnapped) {
            await unsnapInitiator(requestBody);
            setHasSnapped(false);
        } else {
            await snapInitiator(requestBody);
            setHasSnapped(true);
        }
    }

    return (
        <List.Item className="center-horizontal" >
            <Card 
                hoverable 
                className="haiku-display-item"
                onMouseEnter={() => setIsHovering(true)} 
                onMouseLeave={() => setIsHovering(false)}
            >
                <ErrorList errors={snapErrors.concat(unsnapErrors)} />

                <Row justify="center" wrap><Typography.Text strong>{ props.post.firstLine }</Typography.Text></Row>
                <Row justify="center" wrap><Typography.Text strong>{ props.post.firstLine }</Typography.Text></Row>
                <Row justify="center" wrap><Typography.Text strong>{ props.post.firstLine }</Typography.Text></Row>
                
                {
                    isHovering &&
                    <>
                        <Row justify="center" wrap>- {props.post.author.username}</Row>
                        <Row justify="center" wrap>
                            <Button 
                                loading={isSnapLoading || isUnsnapLoading}
                                onClick={handleClick}
                                type={hasSnapped ? "primary" : "default"}
                            >
                                    &#128076;
                            </Button>
                        </Row>
                    </>
                }
            </Card>
        </List.Item>
    );
};