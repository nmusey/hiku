import React from "react";
import { Row } from "antd";
import { HomeOutlined, PlusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";

interface Props {
    openCreatePostModal: () => void;
}

export const Navbar = (props: Props): JSX.Element => {
    return (
        <nav className="fill">
            <Row className="fill" justify="space-between" align="middle">
                <HomeOutlined/>
                <PlusOutlined onClick={props.openCreatePostModal}/>
                <SearchOutlined/>
                <UserOutlined/>
            </Row>
        </nav>
    );
};