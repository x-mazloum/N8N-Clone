import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import HandleBars from "handlebars";
import { slackChannel } from "@/inngest/channels/slack";
import { decode } from "html-entities";
import ky from "ky";

HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    
    return safeString;
});

type SlackData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
    username?: string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
  // Publish "loading" state for discord event
    await publish(
        slackChannel().status({
            nodeId,
            status: "loading",
        }),
    );


    if(!data.webhookUrl) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Slack node: Webhook Url is required")
    }
    if(!data.content) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Slack node: Content is missing")
    }


    const rawContent = HandleBars.compile(data.content)(context);
    const content = decode(rawContent);

    try {
        const result = await step.run("slack-webhook", async () => {
            await ky.post(data.webhookUrl!, {
                json: {
                    content: content, // The key depends on workflow config
                }
            });

            if(!data.variableName) {
                await publish(
                    slackChannel().status({
                        nodeId,
                        status: "error",
                    }),
                );
                throw new NonRetriableError("Slack node: Variable name is missing")
            }

            return {
                ...context,
                [data.variableName]: {
                    messageContent: content.slice(0, 2000),
                }
            }
        })

        await publish(
            slackChannel().status({
                nodeId,
                status: "success",
        }),
    );

    return result;

    } catch (error) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw error;
    }
};