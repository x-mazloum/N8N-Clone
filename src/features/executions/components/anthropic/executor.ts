import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createAnthropic } from "@ai-sdk/anthropic";
import HandleBars from "handlebars";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { generateText } from "ai";

HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    
    return safeString;
});

type AnthropicData = {
    variableName?: string;
    userPrompt?: string;
    systemPrompt?: string;
};

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
  // Publish "loading" state for Anthropic event
    await publish(
        anthropicChannel().status({
            nodeId,
            status: "loading",
        }),
    );

    if(!data.variableName) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Anthropic node: Variable name is missing")
    }

    if(!data.userPrompt) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Anthropic node: User Prompt is missing");
    }

    const systemPrompt = data.systemPrompt ?
                HandleBars.compile(data.systemPrompt)(context)
                : "You are a helpful assistant.";
    const userPrompt = HandleBars.compile(data.userPrompt)(context);

    // TODO: Fetch credential that user selected

    const credentialValue = process.env.ANTHROPIC_API_KEY!;

    const anthropic = createAnthropic({
        apiKey: credentialValue,
    });

    try {
        const { steps } = await step.ai.wrap(
            "anthropic-generate-text",
            generateText,
            {
                model: anthropic("claude-sonnet-4-5"),
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
            anthropicChannel().status({
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
            anthropicChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw error;
    }
};
// there was a bug when executing that the last node overrides the nodes before so only the data of the last node is displayed in inngest(key collision)
// this approach of the variable name fixed this bug explain it in details