import React, { useEffect, useState } from "react";
import { Button, Card, Row, Spin, Typography } from "antd";
import { RequestMethods, useRequest } from "../../hooks/useRequest";
import { UserInfo } from "../../../../common/types/UserInfo";
import { Endpoints } from "../../../../common/constants/Endpoints";
import { isResponseSuccess } from "../../utils/fetch.utils";
import { UserDetailResponse } from "../../../../common/dtos/user/UserDetail";
import { ErrorList } from "../ui/ErrorList";
import { useHistory } from "react-router";
import { Pages } from "../../constants/Pages";
import { FollowButton } from "./FollowButton";
import { readJWT } from "../../utils/jwt.utils";

interface Props {
    username: string;
}

export const UserDetail = (props: Props): JSX.Element => {
    const [ isLoading, errors, getUserDetails ] = useRequest(Endpoints.UserDetails, RequestMethods.GetWithParams);
    const [ user, setUser ] = useState<UserInfo>();
    const history = useHistory();
    const currentUsername = readJWT()?.username;

    useEffect(() => {
        const initialLoad = async () => {
            const { response, responseBody } = await getUserDetails({ username: props.username });

            if (isResponseSuccess(response)) {
                setUser((responseBody as UserDetailResponse).user);
            }
        }

        initialLoad();
    }, [getUserDetails, props.username, setUser, window.location.hash]);

    return (
        <div className="fill">
            <ErrorList errors={errors} />
            {
                isLoading || !user ? 
                <Spin className="center-horizontal" /> : 
                (
                    <Card className="fill center" hoverable>
                        <Row justify="center" className="fill-horizontal">
                            <Typography.Title level={3}>{user!.username}</Typography.Title>
                        </Row>
                        <Row justify="center" className="fill-horizontal">
                            <Typography.Text type="secondary">Followers: {user!.followers}</Typography.Text>
                        </Row>
                        {
                            user.following ?
                                (
                                    <Row justify="center" className="fill-horizontal">
                                        <Typography.Text type="secondary">Following: {user!.following}</Typography.Text>
                                    </Row>
                                ) : null
                        }
                        {
                            props.username === currentUsername ?
                                <Button type="primary" onClick={() => history.push(Pages.Logout.route)}>Logout</Button> :
                                <FollowButton isFollowing={user.doesCurrentUserFollow} userId={user!.id} />
                        }
                    </Card>
                )
            }
        </div>
    );
};