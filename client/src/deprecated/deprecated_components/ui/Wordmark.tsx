import React from "react";
import { Typography } from "antd";

export const Wordmark = (): JSX.Element => {
    function handleClick(): void {
        window.location.replace(window.location.origin);
    }

    return (
        <div onClick={handleClick} className="fill wordmark">
            <Typography.Title level={1} className="fill center-vertical">
                Hiku
            </Typography.Title>
        </div>
    );
};