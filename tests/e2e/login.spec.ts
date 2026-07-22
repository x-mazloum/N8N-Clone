import { expect, test } from "@playwright/test";

test("shows the login page", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByText("Welcome back")).toBeVisible();

  await expect(page.getByLabel("Email")).toBeVisible();

  await expect(page.getByLabel("Password")).toBeVisible();
});
