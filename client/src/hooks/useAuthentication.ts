import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Pages } from "../constants/Pages";
import { readJWT } from "../utils/jwt.utils";

export const useAuthentication = (): void => {
    const history = useHistory();

    useEffect(() => {
        const jwt = readJWT();

        if (!jwt) {
            history.push(Pages.Login.route);
        }

    }, [history.location.hash]);
};