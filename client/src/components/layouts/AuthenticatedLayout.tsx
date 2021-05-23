import React, { useEffect, useState } from "react";
import { Layout, Row } from "antd";
import { Navbar } from "../ui/Navbar";
import { useAuthentication } from "../../hooks/useAuthentication";

export interface Props {
    children: React.ReactNode;
}

export const AuthenticatedLayout = (props: Props): JSX.Element => {
    const MOBILE_BREAKPOINT = 768;
    const { Content } = Layout;

    const [isWideWindow, setIsWideWindow] = useState(window.innerWidth > MOBILE_BREAKPOINT);

    useAuthentication();

    useEffect(() => {
        window.addEventListener("resize", () => {
            setIsWideWindow(window.innerWidth > MOBILE_BREAKPOINT);
        });
    }, []);

    const mobileLayout = (
        <Layout className="fill">
            <Content className="fill center-vertical">
                {
                    props.children
                }
            </Content>
            <Row justify="space-around" align="middle" className="fill">
                <Navbar />
            </Row>
        </Layout>
    );

    const desktopLayout = (
        <Layout className="fill">
            <Row justify="space-around" align="middle" className="fill">
                <Navbar />
            </Row>
            <Content className="fill center-vertical">
                {
                    props.children
                }
            </Content>
        </Layout>
    );

    return isWideWindow ? desktopLayout : mobileLayout;
};