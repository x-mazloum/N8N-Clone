
import { inngest } from "./client";
import { generateText} from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"


const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
    { id: "execute-ai" },
    { event: "execute/ai" },
    async ({ event, step }) => {

        await step.sleep("pretend", "5s")
        const { steps: gemeniSteps } = await step.ai.wrap(
            "gemeni-generate-text", //name of our step
            generateText, // function that we are wrapping
            // properties of the generated text ai 
            {
                model: google("gemini-2.5-flash"),
                system: "You are a helpful assistant",
                prompt: "What is 2 + 2?"
            }
        );
        const { steps: openAiSteps } = await step.ai.wrap(
            "openai-generate-text", //name of our step
            generateText, // function that we are wrapping
            // properties of the generated text ai 
            {
                model: openai("gpt-4.1-mini"),
                system: "You are a helpful assistant",
                prompt: "What is 2 + 2?"
            }
        );
        const { steps: anthropicSteps } = await step.ai.wrap(
            "anthropic-generate-text", //name of our step
            generateText, // function that we are wrapping
            // properties of the generated text ai 
            {
                model: anthropic("claude-sonnet-4-5"),
                system: "You are a helpful assistant",
                prompt: "What is 2 + 2?"
            }
        );
        return {
            gemeniSteps,
            openAiSteps,
            anthropicSteps
        };
    },
);
