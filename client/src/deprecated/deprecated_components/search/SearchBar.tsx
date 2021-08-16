import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { CloseOutlined, LeftOutlined } from "@ant-design/icons";
import { Endpoints } from "../../../../common/constants/Endpoints";
import { SearchRequest, SearchResponse } from "../../../../common/dtos/user/Search";
import { RequestMethods, useRequest } from "../../hooks/useRequest";
import { FieldIds } from "../../constants/FieldIds";
import { UserInfo } from "../../../../common/types/UserInfo";
import { isResponseSuccess } from "../../utils/fetch.utils";
import { SearchResultDrawer } from "./SearchResultsDrawer";
import { useForm } from "antd/lib/form/Form";

interface Props {
    closeSearchBar: () => void;
}

export const SearchBar = (props: Props): JSX.Element => {
    const [ isLoading, errors, initiator ] = useRequest<SearchRequest, SearchResponse>(Endpoints.Search, RequestMethods.Post);

    const [ form ] = useForm();

    const [ searchTerm, setSearchTerm ] = useState("");
    const [ cursor, setCursor ] = useState(1);
    const [ isSearchResultsDrawerOpen, setIsSearchResultsDrawerOpen ] = useState(false);
    const [ searchResults, setSearchResults ] = useState<UserInfo[]>([]);
    const [ searchErrors, setSearchErrors ] = useState<string[]>([]);

    async function loadUsers(): Promise<void> {
        const requestBody = { cursor, searchTerm };
        setIsSearchResultsDrawerOpen(true);

        const { response, responseBody } = await initiator(requestBody);

        if (isResponseSuccess(response)) {
            const { cursor, users } = responseBody as SearchResponse;
            setCursor(cursor);
            setSearchResults(users);
            return;
        }
        
        setSearchErrors(errors);
    }

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
        setSearchTerm(event.target.value);
    }

    function resetSearchBar(): void {
        form.resetFields()
    }

    function closeSearchBar(): void {
        setCursor(1);
        props.closeSearchBar();
        setSearchTerm("");
    }

    function closeSearchResultsDrawer(): void {
        setIsSearchResultsDrawerOpen(false);
        props.closeSearchBar();
    }

    useEffect(() => {
        setCursor(1);
        setSearchResults([]);
    }, [ searchTerm, setCursor, setSearchResults ]);
    
    return (
        <>
            <Form className="fill-horizontal center" form={form} onFinish={loadUsers}>
                <Button onClick={closeSearchBar} icon={<LeftOutlined/>} id="search-return-button"/>
                <Form.Item name={FieldIds.Search} className="fill-horizontal">
                    <Input.Search 
                        placeholder="username" 
                        onSearch={loadUsers}
                        onChange={handleSearchChange}
                        className="fill-horizontal" 
                        suffix={<CloseOutlined onClick={resetSearchBar}/>}
                        loading={isLoading}
                        autoFocus
                    />
                </Form.Item>
            </Form>
            <SearchResultDrawer 
                results={searchResults} 
                errors={searchErrors} 
                visible={isSearchResultsDrawerOpen}
                allUsersLoaded={cursor === 0}
                onClose={closeSearchResultsDrawer}
                loadMore={loadUsers}
            />
        </>
    );
};