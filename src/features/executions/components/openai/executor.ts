import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createOpenAI } from "@ai-sdk/openai"
import HandleBars from "handlebars";
import { openAiChannel } from "@/inngest/channels/openai";
import { generateText } from "ai";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";

HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    
    return safeString;
});

type OpenAiData = {
    credentialId?: string;
    variableName?: string;
    userPrompt?: string;
    systemPrompt?: string;
};

export const openAiExecutor: NodeExecutor<OpenAiData> = async ({
    data,
    nodeId,
    context,
    userId,
    step,
    publish,
}) => {
  // Publish "loading" state for openai event
    await publish(
        openAiChannel().status({
            nodeId,
            status: "loading",
        }),
    );

    if(!data.variableName) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("OpenAi node: Variable name is missing")
    }
    if(!data.credentialId) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("OpenAi node: Credential is missing")
    }

    if(!data.userPrompt) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("OpenAi node: User Prompt is missing")
    }

    const systemPrompt = data.systemPrompt ?
                HandleBars.compile(data.systemPrompt)(context)
                : "You are a helpful assistant.";
    const userPrompt = HandleBars.compile(data.userPrompt)(context);

    // TODO: Fetch credential that user selected

        const credential = await step.run("get-credential", () => {
            return prisma.credential.findUnique({
                where: { id: data.credentialId, userId },
            });
        });

        if (!credential) {
            await publish(
                openAiChannel().status({
                nodeId,
                status: "error",
                }),
            );
            throw new NonRetriableError("Open Ai node: Credential not found");
        }

    const openai = createOpenAI({
        apiKey: decrypt(credential.value),
    });

    try {
        const { steps } = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            {
                model: openai("gpt-5.3-codex"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            },
        )

        const text = 
                steps[0].content[0].type === "text"
                ? steps[0].content[0].text
                : "";

        await publish(
            openAiChannel().status({
                nodeId,
                status: "success",
        }),
    );

    return {
        ...context,
        [data.variableName]: {
            text,
        },
    }
    } catch (error) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw error;
    }
};
// there was a bug when executing that the last node overrides the nodes before so only the data of the last node is displayed in inngest(key collision)
// this approach of the variable name fixed this bug explain it in details