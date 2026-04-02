import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import HandleBars from "handlebars";
import { discordChannel } from "@/inngest/channels/discord";
import { decode } from "html-entities";
import ky from "ky";

HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    
    return safeString;
});

type DiscordData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
    username?: string;
};

export const discordExecutor: NodeExecutor<DiscordData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
  // Publish "loading" state for discord event
    await publish(
        discordChannel().status({
            nodeId,
            status: "loading",
        }),
    );


    if(!data.webhookUrl) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Discord node: Webhook Url is required")
    }
    if(!data.content) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw new NonRetriableError("Discord node: Content is missing")
    }


    const rawContent = HandleBars.compile(data.content)(context);
    const content = decode(rawContent);
    const username = data.username 
            ? decode(HandleBars.compile(data.username)(context))
            : undefined;

    try {
        const result = await step.run("discord-webhook", async () => {
            await ky.post(data.webhookUrl!, {
                json: {
                    content: content.slice(0, 2000), // Discord's max message length
                    username,
                }
            });

            if(!data.variableName) {
                await publish(
                    discordChannel().status({
                        nodeId,
                        status: "error",
                    }),
                );
                throw new NonRetriableError("Discord node: Variable name is missing")
            }

            return {
                ...context,
                [data.variableName]: {
                    messageContent: content.slice(0, 2000),
                }
            }
        })

        await publish(
            discordChannel().status({
                nodeId,
                status: "success",
        }),
    );

    return result;

    } catch (error) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error",
            }),
        );
        throw error;
    }
};
// there was a bug when executing that the last node overrides the nodes before so only the data of the last node is displayed in inngest(key collision)
// this approach of the variable name fixed this bug explain it in details