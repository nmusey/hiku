import { UserInfo } from "../../types/UserInfo";

export interface SearchRequest {
    searchTerm: string;
    cursor: number;
}

export interface SearchResponse {
    users: UserInfo[];
    cursor: number;
}