"use client";
import { Node, NodeProps, useReactFlow} from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import { memo, useState } from "react";
import { useNodeStatus } from "../../hooks/use-node-status";
import { OpenAiDialog, OpenAiFormValues } from "./dialog";

import { OpenAi_CHANNEL_NAME } from "@/inngest/channels/openai";
import { fetchOpenAiRealtimeToken } from "./actions";

type OpenAiNodeData = {
    credentialId?: string;
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
};

type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OpenAi_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAiRealtimeToken,
    });

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: OpenAiFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if(node.id === props.id){
                return {
                    ...node,
                    data: {
                        ...node.data,
                        // endpoint: values.endpoint,
                        // method: values.method,
                        // body: values.body,
                        ...values,
                    }
                }
            }
            return node;
        }))
    }

    const nodeData = props.data;
    const description = nodeData?.userPrompt ?
            `gpt-5.3-codex: ${nodeData.userPrompt.slice(0, 50)}...`
            : "Not Configured!";
        
    return (
        <>
        <OpenAiDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleSubmit}
            defaultValues={nodeData}
        />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/openai.svg"
                name="OpenAi"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
});

OpenAiNode.displayName = "OpenAiNode";