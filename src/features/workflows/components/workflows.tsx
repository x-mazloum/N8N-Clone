"use client";
import { 
        EmptyView,
        EntityContainer, 
        EntityHeader, 
        EntityItem, 
        EntityList, 
        EntityPagination, 
        EntitySearch, 
        ErrorView, 
        LoadingView
    } from "@/components/entity-components";

import { 
        useCreateWorkflow, 
        useRemoveWorkflow, 
        useSuspenseWorkflows 
    } 
    from "../hooks/use-workflows";

import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "../hooks/use-entity-search";
import type { Workflow } from "@/generated/prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";


export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();

    return (
        <EntityList
            items={workflows.data.items}
            getKey={(workflow) => workflow.id}
            renderItem={(workflow) => <WorkflowItem data={workflow}/>}
            emptyView={<WorkflowsEmpty/>}
        />
    )
}

// Workflow Search

export const WorkflowSearch = () => {
    const [params, setParams] = useWorkflowsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams
    })

    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search Workflows"
        />
    )
}


// Workflow Header
export const WorkflowsHeader = ({ disabled }: { disabled?:  boolean}) => {
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal} = useUpgradeModal();
    const router = useRouter();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError: (error) => {
                handleError(error);
            }
        })
    }
    return (
        <>
        {modal}
            <EntityHeader
                title="Workflows"
                description="Create and manage your workflows"
                onNew={handleCreate}
                newButtonLabel="New Workflow"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
            />
        </>
    )
}
// Workflow Pagination
export const WorkflowsPagination = () => {
    const workflows = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParams();

    return (
        <EntityPagination
            disabled={workflows.isFetching}
            totalPages={workflows.data.totalPages}
            page={workflows.data.page}
            onPageChange={(page) => setParams({ ...params, page})}
        />
    )
}


// Workflow Container

export const WorkflowsContainer = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<WorkflowSearch></WorkflowSearch>}
            pagination={<WorkflowsPagination></WorkflowsPagination>}
        >
            {children}
        </EntityContainer>
    )
}

// Loading UI
export const WorkflowsLoading = () => {
    return <LoadingView message="Loading Workflows..." />
}
// Error UI
export const WorkflowsError = () => {
    return <ErrorView message="Error loading workflows..." />
}

// Empty UI

export const WorkflowsEmpty = () => {
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal } = useUpgradeModal();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onError: (error) => {
                handleError(error);
            },
        });
    };
    return (
        <>
            {modal}
            <EmptyView
                onNew={handleCreate}
                message="No workflows found."
            />
        </>
    )
}

// Workflow Item

export const WorkflowItem = ({
    data,
}: {
    data: Workflow
}) => {
    const removeWorkflow = useRemoveWorkflow();

    const handleRemove = () => {
        removeWorkflow.mutate({ id: data.id})
    }
    return (
        <EntityItem
            href={`/workflows/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Updated {formatDistanceToNow(data.updatedAt, {addSuffix: true})}{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(data.createdAt, { addSuffix: true })}
                </>
            }
            image={
                <div className="size-8 flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground"/>
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeWorkflow.isPending}
        />
    )
}