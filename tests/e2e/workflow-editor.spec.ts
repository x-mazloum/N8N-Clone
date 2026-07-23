import { expect, test } from "@playwright/test";

test("saves a workflow and keeps it after reloading", async ({ page }) => {
  /*
   * This is a long E2E flow:
   * signup → create workflow → open editor → add node → save → reload
   *
   * The default Playwright test timeout is 30 seconds.
   * We increase it because this test performs database operations,
   * navigation, authentication, and editor loading.
   */
  test.setTimeout(90_000);

  /*
   * Create a unique email for every test run.
   *
   * Without Date.now(), the second test run could fail because
   * the email is already registered in the test database.
   */
  const email = `e2e-${Date.now()}@example.com`;
  const password = "TestPassword123!";

  // ---------------------------------------------------------
  // 1. Register and authenticate a new test user
  // ---------------------------------------------------------

  // Open the signup page in the real browser.
  await page.goto("/signup");

  /*
   * Find the form fields through their accessible labels.
   *
   * This is better than CSS selectors because it matches
   * how a user or screen reader finds form inputs.
   */
  await page.getByLabel("Email").fill(email);

  await page.getByLabel("Password", { exact: true }).fill(password);

  await page.getByLabel("Confirm Password").fill(password);

  /*
   * Start waiting for the signup API response BEFORE clicking.
   *
   * This prevents a timing problem where the request finishes
   * before Playwright begins listening for it.
   */
  const signUpResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/auth/sign-up/email") &&
      response.request().method() === "POST",
  );

  // Submit the signup form like a real user.
  await page.getByRole("button", { name: /sign up/i }).click();

  // Wait for the signup request to finish.
  const signUpResponse = await signUpResponsePromise;

  /*
   * Confirm that the server accepted the registration.
   *
   * response.ok() is true for successful HTTP responses,
   * usually status codes from 200 to 299.
   */
  expect(signUpResponse.ok()).toBe(true);

  /*
   * Registration automatically signs the user in and redirects
   * them to the workflows page.
   */
  await expect(page).toHaveURL(/\/workflows/, {
    timeout: 10_000,
  });

  // ---------------------------------------------------------
  // 2. Create a new workflow
  // ---------------------------------------------------------

  const newWorkflowButton = page.getByRole("button", {
    name: /new workflow/i,
  });

  // Confirm that the button is ready before clicking it.
  await expect(newWorkflowButton).toBeVisible();

  await newWorkflowButton.click();

  /*
   * Wait for visible confirmation that the server created
   * the workflow successfully.
   */
  await expect(page.getByText(/workflow .* created/i)).toBeVisible({
    timeout: 10_000,
  });

  /*
   * Normally, creating the workflow navigates directly to:
   *
   * /workflows/[workflowId]
   *
   * This fallback handles the case where creation succeeds,
   * but the page remains on the workflow list.
   */
  if (new URL(page.url()).pathname === "/workflows") {
    const createdWorkflowLink = page.locator('a[href^="/workflows/"]').first();

    await expect(createdWorkflowLink).toBeVisible();

    await createdWorkflowLink.click();
  }

  /*
   * Confirm that we reached one specific workflow editor page.
   *
   * Example:
   * /workflows/clx123abc
   */
  await expect(page).toHaveURL(/\/workflows\/[^/]+$/, {
    timeout: 20_000,
  });

  // ---------------------------------------------------------
  // 3. Wait for the editor and add a Manual Trigger node
  // ---------------------------------------------------------

  const addNodeButton = page.getByRole("button", {
    name: /add node/i,
  });

  /*
   * The editor loads workflow data and React Flow asynchronously.
   * Waiting for Add Node proves that the editor is ready.
   */
  await expect(addNodeButton).toBeVisible({
    timeout: 30_000,
  });

  // Open the node selector.
  await addNodeButton.click();

  /*
   * The selector calls this option "Trigger manually".
   * This is different from the text displayed inside the node.
   */
  const manualTriggerOption = page.getByRole("button", {
    name: /trigger manually/i,
  });

  await expect(manualTriggerOption).toBeVisible({
    timeout: 10_000,
  });

  // Add the Manual Trigger node to the workflow.
  await manualTriggerOption.click();

  // ---------------------------------------------------------
  // 4. Save the workflow
  // ---------------------------------------------------------

  const saveButton = page.getByRole("button", {
    name: /save/i,
  });

  await saveButton.click();

  /*
   * Confirm that the application reports a successful save.
   *
   * This proves that the save request completed before reloading.
   */
  await expect(page.getByText(/saved/i)).toBeVisible();

  // ---------------------------------------------------------
  // 5. Reload and verify database persistence
  // ---------------------------------------------------------

  /*
   * Reloading removes the current React state.
   *
   * If the node appears again, it means the workflow was saved
   * to the database and loaded again from the server.
   */
  await page.reload();

  // Wait until the editor has loaded again after the reload.
  await expect(page.getByRole("button", { name: /add node/i })).toBeVisible({
    timeout: 30_000,
  });

  /*
   * The Manual Trigger node displays this text in the editor.
   *
   * This final assertion proves persistence:
   * the node survived the page reload.
   */
  await expect(
    page.getByText("When clicking 'Execute workflow'", {
      exact: true,
    }),
  ).toBeVisible({
    timeout: 20_000,
  });
});
