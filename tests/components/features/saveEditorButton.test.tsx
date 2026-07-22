import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAtomValue } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditorSaveButton } from "@/features/editor/components/editor-header";
import { useUpdateWorkflow } from "@/features/workflows/hooks/use-workflows";

vi.mock("@/features/workflows/hooks/use-workflows", () => ({
  useUpdateWorkflow: vi.fn(),
}));

vi.mock("jotai", async (importOriginal) => {
  const actual = await importOriginal<typeof import("jotai")>();

  return {
    ...actual,
    useAtomValue: vi.fn(),
  };
});
const mutate = vi.fn();
const getNodes = vi.fn();
const getEdges = vi.fn();

describe("EditorSaveButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUpdateWorkflow).mockReturnValue({
      mutate,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateWorkflow>);
  });

  it("saves the current nodes and edges", async () => {
    const user = userEvent.setup();

    const nodes = [
      {
        id: "node-1",
        type: "MANUAL_TRIGGER",
      },
    ];

    const edges = [
      {
        id: "edge-1",
        source: "node-1",
        target: "node-2",
      },
    ];

    getNodes.mockReturnValue(nodes);
    getEdges.mockReturnValue(edges);

    vi.mocked(useAtomValue).mockReturnValue({
      getNodes,
      getEdges,
    });

    render(<EditorSaveButton workflowId="workflow-1" />);

    await user.click(
      screen.getByRole("button", {
        name: /save$/i,
      }),
    );

    expect(getNodes).toHaveBeenCalledOnce();
    expect(getEdges).toHaveBeenCalledOnce();

    expect(mutate).toBeCalledWith({
      id: "workflow-1",
      nodes,
      edges,
    });
  });

  it("doesn't save when the editor is unavailable", async () => {
    const user = userEvent.setup();

    vi.mocked(useAtomValue).mockReturnValue(null);

    render(<EditorSaveButton workflowId="workflow-1" />);

    await user.click(screen.getByRole("button", { name: /save$/i }));

    expect(mutate).not.toHaveBeenCalled();
  });
});
