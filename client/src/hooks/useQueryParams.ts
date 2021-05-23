import { useLocation } from "react-router";

export const useQueryParams = (key: string): string  => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(key) || "";
};