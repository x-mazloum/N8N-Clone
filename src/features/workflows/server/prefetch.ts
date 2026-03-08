import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";


// no need for remembering the props u passed this will automatically infer that 
// Infering the input type 
type Input = inferInput<typeof trpc.workflows.getMany>;

// Prefetch all workflows

export const prefetchWorkflows = (params: Input) => {
    return prefetch(trpc.workflows.getMany.queryOptions(params));
}

// Prefetch a single workflow

export const prefetchWorkflow = (id: string) => {
    return prefetch(trpc.workflows.getOne.queryOptions({ id }))
}