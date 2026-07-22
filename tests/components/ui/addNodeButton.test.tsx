import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AddNodeButton } from "@/features/editor/components/add-node-button";

vi.mock("@/features/editor/components/add-node-button", () => ({
  NodeSelector: ({ open }: { open: boolean }) => {
    if (!open) return null;

    return (
      <div role="dialog" aria-label="Node Selector">
        Select a node
      </div>
    );
  },
}));

describe("AddNodeButton", () => {
  it("keeps the selector hidden initially", () => {
    render(<AddNodeButton />);

    expect(
      screen.queryByRole("dialog", {
        name: /node selector/i,
      }),
    ).not.toBeInTheDocument();
  });
  it("opens the selector when clicked", async () => {
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", {
        name: /add node/i,
      }),
    );

    expect(
      screen.getByRole("dialog", {
        name: /node selector/i,
      }),
    ).toBeInTheDocument();
  });
});
