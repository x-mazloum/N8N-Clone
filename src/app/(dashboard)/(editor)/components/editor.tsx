"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";


// Loading Editor
export const EditorLoading = () => {
    return <LoadingView message="Loading editor..." />
}

// Error
export const EditorError = () => {
    return <ErrorView message="Error loading editor" />
}


export const Editor = ({ workflowId } : { workflowId: string}) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);

    return(
        <p>
            {JSON.stringify(workflow)}
        </p>
    )
}