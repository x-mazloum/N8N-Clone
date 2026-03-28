import { Button } from "@/components/ui/button"
import { useExcecuteWorkflow } from "@/features/workflows/hooks/use-workflows"
import { FlaskConicalIcon } from "lucide-react"


export const ExecuteWorflowButton = ({ workflowId } : { workflowId : string}) => {
    const executeWorflow = useExcecuteWorkflow();

    const handleExecute = () => {
        executeWorflow.mutate({ id: workflowId})
    }
    return (
        <Button size="lg" onClick={handleExecute} disabled={executeWorflow.isPending}>
            <FlaskConicalIcon className="size-4" />
            Execute workflow
        </Button>
    )
}