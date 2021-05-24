import React, { useState } from "react";
import { Drawer, List } from "antd";
import { UserInfo } from "../../../../common/types/UserInfo";
import { LoadMore } from "../ui/LoadMore";
import { SearchResultItem } from "./SearchResultItem";

interface Props {
    results: UserInfo[];
    errors: string[];
    visible: boolean;
    onClose: () => void;
    loadMore: () => Promise<void>;
    allUsersLoaded: boolean;
}

export const SearchResultDrawer = (props: Props): JSX.Element => {
    const [ isLoading, setIsLoading ] = useState(false);

    async function loadMore(): Promise<void> {
        setIsLoading(true);
        await props.loadMore();
        setIsLoading(false);
    }
    
    return (
        <Drawer 
            placement="top"
            visible={props.visible}
            onClose={props.onClose}
            closable
            maskClosable
        >
            <List 
                size="large"
                dataSource={props.results}
                renderItem={user => <SearchResultItem user={user} />}
                loadMore={!props.allUsersLoaded && <LoadMore loadMore={loadMore} />}
                loading={isLoading}
            />
        </Drawer>
    );
};