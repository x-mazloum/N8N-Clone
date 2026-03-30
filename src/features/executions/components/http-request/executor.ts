import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import HandleBars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";


HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    
    return safeString;
});

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
    step,
    publish
}) => {
    // Publish "loading" state for http request
    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "loading",
        }),
    );

    
    try{
        const result = await step.run("http-request", async () => {
            if(!data.endpoint){
            // Publish "Error" state for http request
                await publish(
                    httpRequestChannel().status({
                        nodeId,
                        status: "error",
                    }),
                );
                throw new NonRetriableError("Http Request node: No endpoint configured");
            }
            if(!data.variableName){
            // Publish "Error" state for http request
                    await publish(
                        httpRequestChannel().status({
                            nodeId,
                            status: "error",
                        }),
                    );
                throw new NonRetriableError("Variable name not configured!");
            }
            if(!data.method){
            // Publish "Error" state for http request
                    await publish(
                        httpRequestChannel().status({
                            nodeId,
                            status: "error",
                        }),
                    );
                throw new NonRetriableError("Method not configured!");
            }
            
            // http://.../{{todo.httpResponse.data.userId}}
            const endpoint = HandleBars.compile(data.endpoint)(context);

            const method = data.method;

            const options: KyOptions = { method };

            if(["POST", "PUT", "PATCH"].includes(method)){
                const resolved = HandleBars.compile(data.body || "{}")(context);
                JSON.parse(resolved);
                options.body = resolved;
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

            // if(data.variableName){
                return {
                    ...context,
                    [data.variableName] : responsePayload,
                }
            // }
            // Fallback to direct httpResponse for backward compatibility
            // return{
            //     ...context,
            //     ...responsePayload,
            // };
        })
        // Publish "success" state for http request
            await publish(
                httpRequestChannel().status({
                    nodeId,
                    status: "success",
                }),
            );

        return result;
    } catch (error){
        await publish(
            httpRequestChannel().status({
            nodeId,
            status: "error",
            }),
        );
        throw error;
    }
}
// there was a bug when executing that the last node overrides the nodes before so only the data of the last node is displayed in inngest(key collision)
// this approach of the variable name fixed this bug explain it in details