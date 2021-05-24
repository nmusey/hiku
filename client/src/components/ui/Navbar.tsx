import React, { useState } from "react";
import { Row } from "antd";
import { HomeOutlined, PlusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { HomePage } from "../../constants/Pages";
import { SearchBar } from "../search/SearchBar";

interface Props {
    openCreatePostModal: () => void;
    position: "top" | "bottom";
}

export const Navbar = (props: Props): JSX.Element => {
    const [ isSearchMode, setIsSearchMode ] = useState(false);

    const history = useHistory();

    const style: React.CSSProperties = props.position === "top" ? { top: 0 } : { bottom: 0 };

    return (
        <>
            <div className="navbar-filler"></div>
            <nav className="fill navbar" style={style}>
                
                {
                    isSearchMode ? 
                        <SearchBar closeSearchBar={() => setIsSearchMode(false)} />:
                        <Row className="fill" justify="space-between" align="middle">
                            <HomeOutlined onClick={() =>  history.push(HomePage.route)}/>
                            <PlusOutlined onClick={props.openCreatePostModal} />
                            <SearchOutlined onClick={() => setIsSearchMode(true)} />
                            <UserOutlined/>
                        </Row>
                }   
            </nav>
        </>
    );
};