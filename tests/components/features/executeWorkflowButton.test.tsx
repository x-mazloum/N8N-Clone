import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ExecuteWorflowButton } from "@/features/editor/components/execute-workflow-button";
import { useExcecuteWorkflow } from "@/features/workflows/hooks/use-workflows";

vi.mock("@/features/workflows/hooks/use-workflows", () => ({
  useExcecuteWorkflow: vi.fn(),
}));

const mutate = vi.fn();

describe("ExecuteWorkflowButton", () => {
  beforeEach(() => {
    mutate.mockReset();

    vi.mocked(useExcecuteWorkflow).mockReturnValue({
      mutate,
    } as unknown as ReturnType<typeof useExcecuteWorkflow>);
  });

  it("executes the selected workflow when clicked", async () => {
    const user = userEvent.setup();

    render(<ExecuteWorflowButton workflowId="workflow-123" />);

    await user.click(
      screen.getByRole("button", {
        name: /execute workflow /i,
      }),
    );

    expect(mutate).toHaveBeenCalledOnce();
    expect(mutate).toHaveBeenCalledWith({
      id: "workflow-123",
    });
  });
});
