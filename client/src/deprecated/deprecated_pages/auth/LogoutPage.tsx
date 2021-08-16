import React, { useEffect } from "react";
import { Endpoints } from "../../../../common/constants/Endpoints";
import { RequestMethods, useRequest } from "../../hooks/useRequest";
import { LogoutRequest, LogoutResponse } from "../../../../common/dtos/auth/Logout";
import { Pages } from "../../constants/Pages";
import { useHistory } from "react-router-dom";

export const LogoutPage = (): JSX.Element => {
    const initiator = useRequest<LogoutRequest, LogoutResponse>(Endpoints.Logout, RequestMethods.Post)[2];
    const history = useHistory();

    useEffect(() => {
        const logout = async () => {
            const requestBody: LogoutRequest = {};
            await initiator(requestBody);

            history.push(Pages.Login.route);
        };

        logout();
    }, [initiator, history]);

    return <></>;
};