import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
    variableName?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async({
    data,
    nodeId,
    context,
    step
}) => {
    // Publish "loading" state for http request
    if(!data.endpoint){
    // Publish "Error" state for http request
        throw new NonRetriableError("Http Request node: No endpoint configured");
    }
    if(!data.variableName){
    // Publish "Error" state for http request
        throw new NonRetriableError("Variable name not configured!");
    }
    const result = await step.run("http-request", async () => {
        const endpoint = data.endpoint!;
        const method = data.method || "GET";

        const options: KyOptions = { method };

        if(["POST", "PUT", "PATCH"].includes(method)){
            options.body = data.body;
            options.headers = {
                "Content-Type": "application/json",
            }
        }
        const response = await ky(endpoint, options);
        const contentType = response.headers.get("content-type");
        const responseData = contentType?.includes("applicaton/json")
                    ? await response.json()
                    : await response.text();

        const responsePayload = {
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
            }
        }

        if(data.variableName){
            return {
                ...context,
                [data.variableName] : responsePayload,
            }
        }
        // Fallback to direct httpResponse for backward compatibility
        return{
            ...context,
            ...responsePayload,
        };
    })
    // Publish "success" state for http request

    return result;
}
// there was a bug when executing that the last node overrides the nodes before so only the data of the last node is displayed in inngest(key collision)
// this approach of the variable name fixed this bug explain it in details