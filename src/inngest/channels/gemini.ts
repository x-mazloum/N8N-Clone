import { channel, topic } from "@inngest/realtime"

export const GEMENI_CHANNEL_NAME = "gemini-execution";

export const geminiChannel = channel(GEMENI_CHANNEL_NAME)
    .addTopic(
        topic("status").type<{
            nodeId: string;
            status: "loading" | "success" | "error";
        }>(),
    )