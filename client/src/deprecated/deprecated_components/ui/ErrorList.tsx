import React from "react";
import { Alert } from "antd";

interface Props {
    errors: string[];
}

export const ErrorList = (props: Props): JSX.Element => {
    const message = (
        <ul>
            {
                props.errors.map((error, index) => (
                    <li key={`${index}:${error}`}>{ error }</li>
                ))
            }
        </ul>
    );

    return props.errors.length ? 
        <Alert type="error" message={message} className="fill-horizontal" /> :
        <></>;
};