import React from "react";
import { Button, Form, Input, Row, Typography } from "antd";
import { Link, useHistory } from "react-router-dom";
import { RequestMethods, useRequest } from "../../hooks/useRequest";
import { Endpoints } from "../../../../common/constants/Endpoints";
import { RegisterRequest, RegisterResponse } from "../../../../common/dtos/auth/Register";
import { Pages } from "../../constants/Pages";
import { FieldIds } from "../../constants/FieldIds";
import { isResponseSuccess } from "../../utils/fetch.utils";
import { ErrorList } from "../ui/ErrorList";

export const RegisterForm = (): JSX.Element => {
    const history = useHistory();
    const [isLoading, errors, initiator] = useRequest<RegisterRequest, RegisterResponse>(Endpoints.Register, RequestMethods.Post);

    async function handleFinish(values: Record<string, string>): Promise<void> {
        const requestBody: RegisterRequest = {
            email: values[FieldIds.Email],
            username: values[FieldIds.Username],
            password: values[FieldIds.Password]
        };

        const { response } = await initiator(requestBody);

        if (isResponseSuccess(response)) {
            history.push(Pages.RegisterSuccess.route);
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

                <Form.Item name={FieldIds.Username}>
                    <Input placeholder="Username"/>
                </Form.Item>

                <Form.Item name={FieldIds.Password }>
                    <Input type="password" placeholder="Password"/>
                </Form.Item>

                <Row className="fill-horizontal" justify="center">
                    <Button type="primary" loading={isLoading} htmlType="submit">Register</Button>
                </Row>
            </Form>

            <Row className="fill-horizontal margin-vertical" justify="center">
                <Typography>Already have an account? <Link to={Pages.Login.route}>Log in.</Link></Typography>
            </Row>
        </>
    );
};