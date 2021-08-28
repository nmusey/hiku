import React from "react";
import "./Card.less";

export interface Props {
    children: React.ReactNode;
    className?: string;
}

export const Card = (props: Props): JSX.Element => {
    return (
        <div className={`card ${props.className || ""}`}>
            {
                props.children
            }
        </div>
    );
};