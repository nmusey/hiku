import React, { useEffect, useState } from "react";
import { Spin, Typography } from "antd";
import { Endpoints } from "../../constants/Endpoints";
import { ErrorResponse, RequestMethods, useRequest } from "../../hooks/useRequest";
import { ConfirmRegistrationRequest, ConfirmRegistrationResponse } from "../../../../common/dtos/auth/ConfirmRegistration";
import { isResponseSuccess } from "../../utils/fetch.utils";
import { useHistory } from "react-router";
import { Pages } from "../../constants/Pages";
import ErrorList from "antd/lib/form/ErrorList";

interface Props {
    username: string;
    token: string;
}

export const ConfirmRegistration = (props: Props): JSX.Element => {
    const [ isLoading, initiator ] = useRequest<ConfirmRegistrationRequest, ConfirmRegistrationResponse>(Endpoints.ConfirmRegistration, RequestMethods.Post);
    const [ errors, setErrors ] = useState<string[]>([]);
    const history = useHistory();
    
    useEffect(() => {
        const confirm = async () => {
            const requestBody: ConfirmRegistrationRequest = {
                username: props.username,
                token: props.token
            };

            const { response, responseBody } = await initiator(requestBody);

            if (isResponseSuccess(response)) {
                history.push(Pages.PostList.route);
                return;
            }

            setErrors((responseBody as ErrorResponse).errors);
        };

        confirm();
    }, []);

    return (
        <>
            <Typography>Confirming your email. You will be redirected in a moment.</Typography>
            <ErrorList errors={errors} />
            {
                isLoading && <Spin />
            }
        </>
    );
};