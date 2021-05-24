import React, { useEffect, useState } from "react";
import { Layout, Row } from "antd";
import { Navbar } from "../ui/Navbar";
import { useAuthentication } from "../../hooks/useAuthentication";
import { CreatePostModal } from "../post/CreatePostModal";

export interface Props {
    children: React.ReactNode;
}

export const AuthenticatedLayout = (props: Props): JSX.Element => {
    const MOBILE_BREAKPOINT = 768;
    const { Content } = Layout;

    const [isWideWindow, setIsWideWindow] = useState(window.innerWidth > MOBILE_BREAKPOINT);
    const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
    
    useEffect(() => {
        function resizeHandler() {
            setIsWideWindow(window.innerWidth > MOBILE_BREAKPOINT);
        }

        window.addEventListener("resize", resizeHandler);
        return () => window.removeEventListener("resize", resizeHandler);
    }, []);
    
    useAuthentication();

    const ModalContainer = (
        <>
            <CreatePostModal visible={createPostModalOpen} closeModal={() => setCreatePostModalOpen(false) }/>
        </>
    );

    const mobileLayout = (
        <Layout className="fill">
            <Content className="fill center-vertical">
                {
                    props.children
                }
            </Content>
            <Row justify="space-around" align="middle" className="fill">
                <Navbar openCreatePostModal={() => setCreatePostModalOpen(true)} />
            </Row>
            { ModalContainer }
        </Layout>
    );

    const desktopLayout = (
        <Layout className="fill">
            <Row justify="space-around" align="middle" className="fill">
                <Navbar openCreatePostModal={() => setCreatePostModalOpen(true)} />
            </Row>
            <Content className="fill center-vertical">
                {
                    props.children
                }
            </Content>
            { ModalContainer }
        </Layout>
    );

    return isWideWindow ? desktopLayout : mobileLayout;
};