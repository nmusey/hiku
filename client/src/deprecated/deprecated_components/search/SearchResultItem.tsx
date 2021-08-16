import { DoubleRightOutlined } from "@ant-design/icons";
import { Col, List, Row } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
import { UserInfo } from "../../../../common/types/UserInfo";
import { Pages } from "../../constants/Pages";
import { replaceParams } from "../../utils/url.utils";

interface Props {
    user: UserInfo;
}

export const SearchResultItem = (props: Props): JSX.Element => {
    const history = useHistory();

    function goToUserPage(): void {
        const userPageUrl = replaceParams(Pages.UserDetails, { username: props.user.username });

        if (history.location.pathname == userPageUrl) {
            location.reload();
        } else {
            history.push(userPageUrl);
        }
    }

    return (
        <List.Item key={props.user.id} >
            <Row className="fill-horizontal">
                <Col xs={22}>
                    { props.user.username }
                </Col>
                <Col xs={1}></Col>
                <Col xs={1}>
                    <DoubleRightOutlined onClick={goToUserPage}/>
                </Col>
            </Row>
        </List.Item>
    );
};