import React, { useState } from "react";
import { Divider, Form, Input, Modal, Spin, Typography } from "antd";
import { RequestMethods, useRequest } from "../../hooks/useRequest";
import { Endpoints } from "../../../../common/constants/Endpoints";
import { ErrorList } from "../ui/ErrorList";
import { FieldIds } from "../../constants/FieldIds";
import { CreatePostRequest, CreatePostResponse } from "../../../../common/dtos/post/CreatePost";
import { isResponseSuccess } from "../../utils/fetch.utils";

interface Props {
    visible: boolean;
    closeModal: () => void;
}

export const CreatePostModal = (props: Props): JSX.Element => {
    const [isLoading, errors, initiator] = useRequest<CreatePostRequest, CreatePostResponse>(Endpoints.CreatePost, RequestMethods.Post);

    const [firstLine, setFirstLine] = useState("");
    const [secondLine, setSecondLine] = useState("");
    const [thirdLine, setThirdLine] = useState("");

    async function handleSubmit(): Promise<void> {
        const requestBody: CreatePostRequest = { firstLine, secondLine, thirdLine };
        
        const firstLineCopy = firstLine;
        const secondLineCopy = secondLine;
        const thirdLineCopy = thirdLine;

        const { response } = await initiator(requestBody);

        if (isResponseSuccess(response)) {
            props.closeModal();
        }

        setFirstLine(firstLineCopy);
        setSecondLine(secondLineCopy);
        setThirdLine(thirdLineCopy);
    }

    return (
        <Modal 
            visible={props.visible} 
            onCancel={props.closeModal}
            onOk={handleSubmit}
            cancelText="Close"
            okText="Post"
        >
            <Typography.Title level={3}>Create a new haiku</Typography.Title>

            <Divider />

            <ErrorList errors={errors} />
            {
                isLoading ?
                <Spin /> :
                <Form layout="vertical">
                <Form.Item name={FieldIds.FirstLine}>
                    <Input 
                        placeholder="Your first line goes here"
                        value={firstLine} 
                        onChange={(event) => setFirstLine(event.target.value)}
                    />
                </Form.Item>

                <Form.Item name={FieldIds.SecondLine}>
                    <Input 
                        placeholder="And then your second one here"
                        value={secondLine} 
                        onChange={(event) => setSecondLine(event.target.value)}
                    />
                </Form.Item>

                <Form.Item name={FieldIds.ThirdLine}>
                    <Input 
                        placeholder="Then wrap it up here"
                        value={thirdLine} 
                        onChange={(event) => setThirdLine(event.target.value)}
                    />
                </Form.Item>
            </Form>
            }
        </Modal>
    );
};