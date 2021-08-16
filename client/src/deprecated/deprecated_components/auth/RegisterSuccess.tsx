import React from "react";
import { Typography } from "antd";

export const RegisterSuccess = (): JSX.Element => {
    return (
        <>
            <Typography.Title level={4} className="fill center">
                Please check your email to confirm your account.
            </Typography.Title>
        </>
    );
};