import { DoubleRightOutlined } from "@ant-design/icons";
import { Col, List, Row } from "antd";
import React from "react";
import { UserInfo } from "../../../../common/types/UserInfo";

interface Props {
    user: UserInfo;
}

export const SearchResultItem = (props: Props): JSX.Element => {
    return (
        <List.Item key={props.user.id} >
            <Row className="fill-horizontal">
                <Col xs={22}>
                    { props.user.username }
                </Col>
                <Col xs={1}></Col>
                <Col xs={1}>
                    <DoubleRightOutlined />
                </Col>
            </Row>
        </List.Item>
    );
};