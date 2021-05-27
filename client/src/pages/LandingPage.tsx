import React from "react";
import { Row, Col, Typography, Space, Button } from "antd";
import { useHistory } from "react-router-dom";
import { Pages } from "../constants/Pages";
import PeopleImage from "../../assets/images/people.svg";
import "../styles/landingPage.less";

export const LandingPage = (): JSX.Element => {
    const history = useHistory();

    return (
        <Row className="landing-page">
            <Col xs={24} md={16}>
                <Space direction="vertical" size="large" className="fill-horizontal">
                    <Typography.Title level={1}>Hiku</Typography.Title>
                    <Typography.Title level={2}>Social media in seventeen syllables.</Typography.Title>
                </Space>
            </Col>

            <Col xs={24} md={8}>
                <Row className="fill-horizontal action-buttons" justify="space-around">
                    <Button type="primary" onClick={() => history.push(Pages.Register.route)}>Register</Button>
                    <Button type="default" onClick={() => history.push(Pages.Login.route)}>Login</Button>
                </Row>
            </Col>

            <Col xs={24}>
                <img src={PeopleImage} alt="Two people on their phones" id="people-img"/>
            </Col>
        </Row>
    );
};