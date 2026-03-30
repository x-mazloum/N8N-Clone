import type { NodeExecutor } from "@/features/executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger";


type GoogleFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<GoogleFormTriggerData> = async({
    nodeId,
    context,
    step,
    publish
}) => {
    // Publish "loading" state for manual trigger
    await publish(
        googleFormTriggerChannel().status({
            nodeId,
            status: "loading",
        }),
    )
    const result = await step.run("google-form-trigger", async () => context);
    
    // Publish "success" state for manual trigger
    await publish(
        googleFormTriggerChannel().status({
            nodeId,
            status: "success",
        }),
    );

    return result;
}
