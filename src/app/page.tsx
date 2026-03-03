"use client";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";



const Page = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const create = useMutation(trpc.createWorkflow.mutationOptions
    ({
      onSuccess: () => {
        // queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
        toast.success("Job queued!");
      }
    })
  )
  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess: () => {
      toast.success("AI Job Queued")
    }
  }))

  return(
    <div 
      className="min-h-screen min-w-screen flex items-center justify-center">
        protected server component
        <div>
          {JSON.stringify(data, null, 2)}
        </div>
        <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
          Test AI
        </Button>
        <Button disabled={create.isPending} onClick={() => create.mutate()}>
          create Workflow
        </Button>
    </div>
  )
}

export default Page;