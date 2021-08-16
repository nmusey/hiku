import React from "react";
import { Form, Input, message, Modal, Spin } from "antd";
import { RequestMethods, useRequest } from "../../hooks/useRequest";
import { Endpoints } from "../../../../common/constants/Endpoints";
import { ErrorList } from "../ui/ErrorList";
import { FieldIds } from "../../constants/FieldIds";
import { CreatePostRequest, CreatePostResponse } from "../../../../common/dtos/post/CreatePost";
import { isResponseSuccess } from "../../utils/fetch.utils";
import { useForm } from "antd/lib/form/Form";

interface Props {
    visible: boolean;
    closeModal: () => void;
}

export const CreatePostModal = (props: Props): JSX.Element => {
    const [ isLoading, errors, initiator ] = useRequest<CreatePostRequest, CreatePostResponse>(Endpoints.CreatePost, RequestMethods.Post);
    const [ form ] = useForm();

    async function handleSubmit(): Promise<void> {
        const requestBody: CreatePostRequest = { 
            firstLine: form.getFieldValue(FieldIds.FirstLine), 
            secondLine: form.getFieldValue(FieldIds.SecondLine), 
            thirdLine: form.getFieldValue(FieldIds.ThirdLine)
        };

        const { response } = await initiator(requestBody);

        if (isResponseSuccess(response)) {
            form.resetFields();
            message.success("Your haiku was posted successfully. Please refresh the page if you'd like to see it.", 5);
            props.closeModal();
        }
    }

    return (
        <Modal 
            visible={props.visible} 
            onCancel={props.closeModal}
            onOk={handleSubmit}
            cancelText="Close"
            okText="Post"
            title="Create a new haiku"
        >
            <ErrorList errors={errors} />
            {
                isLoading ?
                <Spin /> :
                <Form layout="vertical" form={form}>
                    <Form.Item name={FieldIds.FirstLine}>
                        <Input placeholder="Your first line goes here" />
                    </Form.Item>

                    <Form.Item name={FieldIds.SecondLine}>
                        <Input placeholder="And then your second one here" />
                    </Form.Item>

                    <Form.Item name={FieldIds.ThirdLine}>
                        <Input placeholder="Then wrap it up here" />
                    </Form.Item>
                </Form>
            }
        </Modal>
    );
};