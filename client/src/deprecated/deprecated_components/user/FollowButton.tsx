import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { Endpoints } from "../../../../common/constants/Endpoints";
import { RequestMethods, useRequest } from "../../hooks/useRequest";
import { FollowRequest, FollowResponse } from "../../../../common/dtos/user/Follow";
import { UnfollowRequest, UnfollowResponse } from "../../../../common/dtos/user/Unfollow";

interface Props {
    isFollowing: boolean;
    userId: number;
}

export const FollowButton = (props: Props): JSX.Element => {
    const [ isFollowLoading, followErrors, followInitiator ] = useRequest<FollowRequest, FollowResponse>(Endpoints.Follow, RequestMethods.Post);
    const [ isUnfollowLoading, unfollowErrors, unfollowInitiator ] = useRequest<UnfollowRequest, UnfollowResponse>(Endpoints.Unfollow, RequestMethods.Post);
    const [ isFollowing, setIsFollowing ] = useState(props.isFollowing);

    function follow(): void {
        followInitiator({ userId: props.userId });
        setIsFollowing(true);
    }

    function unfollow(): void {
        unfollowInitiator({ userId: props.userId });
        setIsFollowing(false);
    }

    useEffect(() => {
        setIsFollowing(props.isFollowing);
    }, [ props.isFollowing ]);

    return (
        <Button 
            type={ isFollowing ? "default" : "primary" } 
            onClick={ () => isFollowing ? unfollow() : follow() }
            loading={ isFollowLoading || isUnfollowLoading }
            danger={ !!(followErrors.length || unfollowErrors.length) }
        >
            {
                isFollowing ?
                    "Unfollow" :
                    "Follow"
            }
        </Button>
    );
};