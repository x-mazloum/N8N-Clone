import { prefetch, trpc } from "@/trpc/server";
import type { inferInput } from "@trpc/tanstack-react-query";


// no need for remembering the props u passed this will automatically infer that 
// Infering the input type 
type Input = inferInput<typeof trpc.credentials.getMany>;

// Prefetch all credentials

export const prefetchCredentials = (params: Input) => {
    return prefetch(trpc.credentials.getMany.queryOptions(params));
}

// Prefetch a single Credential

export const prefetchCredential = (id: string) => {
    return prefetch(trpc.credentials.getOne.queryOptions({ id }))
}