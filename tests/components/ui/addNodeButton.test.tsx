import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactFlowProvider } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";
import { AddNodeButton } from "@/features/editor/components/add-node-button";

// vi.mock("@/features/editor/components/add-node-button", () => ({
//   NodeSelector: ({ open }: { open: boolean }) => {
//     if (!open) return null;

//     return (
//       <div role="dialog" aria-label="Node Selector">
//         Select a node
//       </div>
//     );
//   },
// }));

const renderAddNodeButton = () => {
  return render(
    <ReactFlowProvider>
      <AddNodeButton />
    </ReactFlowProvider>,
  );
};

describe("AddNodeButton", () => {
  it("keeps the selector hidden initially", () => {
    renderAddNodeButton();

    expect(
      screen.queryByRole("dialog", {
        name: /node selector/i,
      }),
    ).not.toBeInTheDocument();
  });
  it("opens the selector when clicked", async () => {
    const user = userEvent.setup();

    renderAddNodeButton();

    await user.click(
      screen.getByRole("button", {
        name: /add node/i,
      }),
    );

    expect(
      screen.getByRole("dialog", {
        name: /what triggers this workflow/i,
      }),
    ).toBeInTheDocument();
  });
});
