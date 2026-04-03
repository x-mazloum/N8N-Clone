import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";


// no need for remembering the props u passed this will automatically infer that 
// Infering the input type 
type Input = inferInput<typeof trpc.executions.getMany>;

// Prefetch all executions

export const prefetchExecutions = (params: Input) => {
    return prefetch(trpc.executions.getMany.queryOptions(params));
}

// Prefetch a single Execution

export const prefetchExecution = (id: string) => {
    return prefetch(trpc.executions.getOne.queryOptions({ id }))
}