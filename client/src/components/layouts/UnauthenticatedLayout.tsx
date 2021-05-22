import React from "react";
import { Layout, Row } from "antd";
import { Wordmark } from "../ui/Wordmark";

export interface Props {
    children: React.ReactNode;
}

export const UnauthenticatedLayout = (props: Props): JSX.Element => {
    const { Header, Content } = Layout;

    return (
        <Layout className="fill">
            <Header className="fill-horizontal">
                <Row justify="start" align="middle" className="fill">
                    <Wordmark />
                </Row>
            </Header>
            <Content className="fill center-vertical">
                {
                    props.children
                }
            </Content>
        </Layout>
    );  
};