import React from "react";
import { Button, Form, Input, Row, Typography } from "antd";
import { Link, useHistory } from "react-router-dom";
import { RequestMethods, useRequest } from "../../hooks/useRequest";
import { Endpoints } from "../../constants/Endpoints";
import { LoginRequest, LoginResponse } from "../../../../common/dtos/auth/Login";
import { Pages } from "../../constants/Pages";
import { FieldIds } from "../../constants/FieldIds";
import { isResponseSuccess } from "../../utils/fetch.utils";
import { ErrorList } from "../ui/ErrorList";

export const LoginForm = (): JSX.Element => {
    const history = useHistory();
    const [isLoading, errors, initiator] = useRequest<LoginRequest, LoginResponse>(Endpoints.Login, RequestMethods.Post);

    async function handleFinish(values: Record<string, string>): Promise<void> {
        const requestBody: LoginRequest = {
            email: values[FieldIds.Email],
            password: values[FieldIds.Password]
        };

        const { response } = await initiator(requestBody);

        if (isResponseSuccess(response)) {
            history.push(Pages.PostList.route);
            return;
        }
    }
    
    return (
        <>
            <ErrorList errors={errors} />
            <Form onFinish={handleFinish} layout="vertical">
                <Form.Item name={FieldIds.Email}>
                    <Input type="email" placeholder="Email"/>
                </Form.Item>

                <Form.Item name={FieldIds.Password }>
                    <Input type="password" placeholder="Password"/>
                </Form.Item>

                <Row className="fill-horizontal" justify="center">
                    <Button type="primary" loading={isLoading} htmlType="submit">Login</Button>
                </Row>
            </Form>

            <Row className="fill-horizontal margin-vertical" justify="center">
                <Typography>Need an account? <Link to={Pages.Register.route}>Register now.</Link></Typography>
            </Row>
        </>
    );
};