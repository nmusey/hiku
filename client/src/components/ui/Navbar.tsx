import React from "react";
import { Row } from "antd";
import { HomeOutlined, PlusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";

export const Navbar = (): JSX.Element => {
    return (
        <nav className="fill">
            <Row className="fill" justify="space-between" align="middle">
                <HomeOutlined/>
                <PlusOutlined/>
                <SearchOutlined/>
                <UserOutlined/>
            </Row>
        </nav>
    );
};