"use client";
import { Node, NodeProps, useReactFlow} from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import { memo, useState } from "react";
import { useNodeStatus } from "../../hooks/use-node-status";
import { GeminiDialog, GeminiFormValues } from "./dialog";
import { fetchGeminiRealtimeToken } from "./actions";
import { GEMENI_CHANNEL_NAME } from "@/inngest/channels/gemini";

type GeminiNodeData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GEMENI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGeminiRealtimeToken,
    });

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: GeminiFormValues) => {
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
            `gemma-3-27b-it: ${nodeData.userPrompt.slice(0, 50)}...`
            : "Not Configured!";
        
    return (
        <>
        <GeminiDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleSubmit}
            defaultValues={nodeData}
        />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/logos/gemini.svg"
                name="Gemini"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    )
});

GeminiNode.displayName = "GeminiNode";