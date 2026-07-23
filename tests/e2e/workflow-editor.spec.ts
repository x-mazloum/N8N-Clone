import { expect, test } from "@playwright/test";

test("saves a workflow and keep it after reloading", async ({ page }) => {
  // Arrange
  await page.goto("/workflows");

  // Act: Create Workflow
  await page
    .getByRole("button", {
      name: /create workflow/i,
    })
    .click();

  console.log("Current URL:", page.url());

  console.log("PAGE:", await page.locator("body").innerText());

  // Confirm editor opened
  await expect(page).toHaveURL(/\/workflows\/.+/);

  // Act: add a node
  await page
    .getByRole("button", {
      name: /add node/i,
    })
    .click();

  await page
    .getByText("Manual Trigger", {
      exact: true,
    })
    .click();

  // Act: Save
  await page
    .getByRole("button", {
      name: /save/i,
    })
    .click();

  // Assert Save Result

  await expect(page.getByText("saved")).toBeVisible();

  // Reload the browser
  await page.reload();

  // Assert Persistence

  await expect(
    page.getByText("Manual Trigger", {
      exact: true,
    }),
  ).toBeVisible();
});
