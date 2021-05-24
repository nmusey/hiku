import React from "react";
import { Card, List, Row } from "antd";
import { PostWithAuthor } from "../../../../common/types/PostWithAuthor";
import Text from "antd/lib/typography/Text";

interface Props {
    post: PostWithAuthor;
}

export const PostListItem = (props: Props): JSX.Element => {
    return (
        <List.Item className="center-horizontal">
            <Card hoverable className="haiku-display-item">
                <Row justify="center" wrap><Text strong>{ props.post.firstLine }</Text></Row>
                <Row justify="center" wrap><Text strong>{ props.post.firstLine }</Text></Row>
                <Row justify="center" wrap><Text strong>{ props.post.firstLine }</Text></Row>
                <Row justify="center" wrap>- {props.post.author.username}</Row>
            </Card>
        </List.Item>
    );
};