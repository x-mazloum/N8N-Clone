import { render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Editor } from "@/features/editor/components/editor";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { NodeType } from "@/generated/prisma/enums";

vi.mock("@/features/workflows/hooks/use-workflows", () => ({
  useSuspenseWorkflow: vi.fn(),
}));

vi.mock("@xyflow/react", () => ({
  ReactFlow: ({ children }: PropsWithChildren) => <div>{children}</div>,
  Background: () => null,
  MiniMap: () => null,
  Controls: () => null,
  Panel: ({ children }: PropsWithChildren) => <>{children}</>,
  applyNodeChanges: vi.fn(),
  applyEdgeChanges: vi.fn(),
  addEdge: vi.fn(),
}));

vi.mock("@/features/editor/components/add-node-button", () => ({
  AddNodeButton: () => <button type="submit"> Add Node </button>,
}));

vi.mock("@/features/editor/components/execute-workflow-button", () => ({
  executeWorkflowButton: () => <button type="submit"> Execute Workflow</button>,
}));

vi.mock("jotai", () => ({
  useSetAtom: vi.fn(),
}));

const mockWorkflow = (
  nodes: Array<{
    id: string;
    type: NodeType;
  }>,
) => {
  vi.mocked(useSuspenseWorkflow).mockReturnValue({
    data: {
      id: "workflow-1",
      name: "Test Workflow",
      nodes: nodes.map((node) => ({
        ...node,
        position: { x: 0, y: 0 },
        data: {},
      })),
      edges: [],
    },
  } as unknown as ReturnType<typeof useSuspenseWorkflow>);
};

describe("Editor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an execution button when manual trigger exists", () => {
    mockWorkflow([
      {
        id: "worflow-1",
        type: NodeType.MANUAL_TRIGGER,
      },
    ]);

    render(<Editor workflowId="workflow-1" />);

    expect(
      screen.getByRole("button", { name: /execute workflow/i }),
    ).toBeInTheDocument();
  });

  it("hides Execute without a manual trigger", () => {
    mockWorkflow([
      {
        id: "workflow-1",
        type: NodeType.HTTP_REQUEST,
      },
    ]);

    render(<Editor workflowId="workflow-1" />);

    expect(
      screen.queryByRole("button", {
        name: /execute workflow /i,
      }),
    ).not.toBeInTheDocument();
  });
});
