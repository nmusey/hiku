import { Button } from "antd";
import * as React from "react";

interface Props {
    loadMore: () => void;
}

export const LoadMore = (props: Props): JSX.Element => (
    <Button onClick={props.loadMore}>Load more</Button>
);