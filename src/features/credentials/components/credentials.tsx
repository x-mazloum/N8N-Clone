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

import { useRouter } from "next/navigation";

import { CredentialType } from "@/generated/prisma/enums";
import type { Credential } from "@/generated/prisma/client";
import { formatDistanceToNow } from "date-fns";
import { useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/features/workflows/hooks/use-entity-search";
import Image from "next/image";


export const CredentialsList = () => {
    const credentials = useSuspenseCredentials();

    return (
        <EntityList
            items={credentials.data.items}
            getKey={(credential) => credential.id}
            renderItem={(credential) => <CredentialsItem data={credential}/>}
            emptyView={<CredentialsEmpty/>}
        />
    )
}


// Credential Search

export const CredentialsSearch = () => {
    const [params, setParams] = useCredentialsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams
    })

    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search Credentials"
        />
    )
}


// Credential Header
export const CredentialsHeader = ({ disabled }: { disabled?:  boolean}) => {

    return (
        <EntityHeader
        title="Credentials"
        description="Create and manage your credentials"
        newButtonHref="/credentials/new"
        newButtonLabel="New Credentials"
        disabled={disabled}
        />
    )
}

// Credential Pagination
export const CredentialsPagination = () => {
    const credentials = useSuspenseCredentials();
    const [params, setParams] = useCredentialsParams();

    return (
        <EntityPagination
            disabled={credentials.isFetching}
            totalPages={credentials.data.totalPages}
            page={credentials.data.page}
            onPageChange={(page) => setParams({ ...params, page})}
        />
    )
}


// Credential Container

export const CredentialsContainer = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <EntityContainer
            header={<CredentialsHeader />}
            search={<CredentialsSearch></CredentialsSearch>}
            pagination={<CredentialsPagination></CredentialsPagination>}
        >
            {children}
        </EntityContainer>
    )
}

// Loading UI
export const CredentialsLoading = () => {
    return <LoadingView message="Loading credentials..." />
}
// Error UI
export const CredentialsError = () => {
    return <ErrorView message="Error loading credentials..." />
}

// Empty UI

export const CredentialsEmpty = () => {
    const router = useRouter();

    const handleCreate = () => {
        router.push(`/credentials/new`)
    };
    return (
        <EmptyView
            onNew={handleCreate}
            message="No credentials found."
        />
    )
}


const credentialLogos: Record<CredentialType, string> = {
    [CredentialType.OPENAI]: "/openai.svg",
    [CredentialType.ANTHROPIC]: "/anthropic.svg",
    [CredentialType.GEMINI]: "/logos/gemini.svg",
};


// Credential Item

export const CredentialsItem = ({
    data,
}: {
    data: Credential
}) => {
    const removeCredential = useRemoveCredential();

    const handleRemove = () => {
        removeCredential.mutate({ id: data.id})
    }
    const logo = credentialLogos[data.type] || "/openai.svg";

    return (
        <EntityItem
            href={`/credentials/${data.id}`}
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
                    <Image src={logo} alt={data.type} width={20} height={20} />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}
        />
    )
}