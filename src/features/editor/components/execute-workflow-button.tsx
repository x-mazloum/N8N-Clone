import { FlaskConicalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExcecuteWorkflow } from "@/features/workflows/hooks/use-workflows";

export const ExecuteWorflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorflow = useExcecuteWorkflow();

  const handleExecute = () => {
    executeWorflow.mutate({ id: workflowId });
  };
  return (
    <Button
      aria-label="Execute Workflow"
      size="lg"
      onClick={handleExecute}
      disabled={executeWorflow.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      Execute workflow
    </Button>
  );
};
