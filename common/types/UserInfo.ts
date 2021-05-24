export interface UserInfo {
    id: number;
    username: string;
    followers: number;
    following?: number;
    doesCurrentUserFollow: boolean;
}