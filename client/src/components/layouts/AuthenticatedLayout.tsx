import React, { useEffect, useState } from "react";
import { Layout, Row } from "antd";
import { Navbar } from "../ui/Navbar";
import { useAuthentication } from "../../hooks/useAuthentication";
import { CreatePostModal } from "../post/CreatePostModal";

interface Props {
    children: React.ReactNode;
}

export const AuthenticatedLayout = (props: Props): JSX.Element => {
    const MOBILE_BREAKPOINT = 768;
    const { Content } = Layout;

    const [ isWideWindow, setIsWideWindow ] = useState(window.innerWidth > MOBILE_BREAKPOINT);
    const [ isCreatePostModalOpen, setIsCreatePostModalOpen ] = useState(false);
    
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
            <CreatePostModal visible={isCreatePostModalOpen} closeModal={() => setIsCreatePostModalOpen(false) }/>
        </>
    );

    const Main = (
        <Content className="fill center-vertical" id="main-container">
            {
                props.children
            }
        </Content>
    );



    const mobileLayout = (
        <Layout className="fill">
            { Main }
            <Row justify="space-around" align="middle" className="fill">
                <Navbar 
                    openCreatePostModal={() => setIsCreatePostModalOpen(true)} 
                    position="bottom"
                />
            </Row>
            { ModalContainer }
        </Layout>
    );

    const desktopLayout = (
        <Layout className="fill">
            <Row justify="space-around" align="middle" className="fill">
                <Navbar 
                    openCreatePostModal={() => setIsCreatePostModalOpen(true)} 
                    position="top"
                />
            </Row>
            { Main }
            { ModalContainer }
        </Layout>
    );

    return isWideWindow ? desktopLayout : mobileLayout;
};