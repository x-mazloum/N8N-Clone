# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow-editor.spec.ts >> saves a workflow and keep it after reloading
- Location: tests\e2e\workflow-editor.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /create workflow/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - link "Nodebase Nodebase" [ref=e4] [cursor=pointer]:
      - /url: /
      - img "Nodebase" [ref=e5]
      - text: Nodebase
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]: Welcome back
        - generic [ref=e10]: Login to continue
      - generic [ref=e13]:
        - generic [ref=e14]:
          - button "GitHub Continue with GitHub" [ref=e15] [cursor=pointer]:
            - img "GitHub" [ref=e16]
            - text: Continue with GitHub
          - button "Google Continue with Google" [ref=e17] [cursor=pointer]:
            - img "Google" [ref=e18]
            - text: Continue with Google
        - generic [ref=e19]:
          - generic [ref=e20]:
            - generic [ref=e21]: Email
            - textbox "Email" [ref=e22]:
              - /placeholder: m@example.com
          - generic [ref=e23]:
            - generic [ref=e24]: Password
            - textbox "Password" [ref=e25]:
              - /placeholder: "********"
          - button "Login" [ref=e26] [cursor=pointer]
        - generic [ref=e27]:
          - text: Don't have an account?
          - link "Sign up" [ref=e28] [cursor=pointer]:
            - /url: /signup
  - region "Notifications alt+T"
  - alert [ref=e29]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("saves a workflow and keep it after reloading", async ({ page }) => {
  4  |   // Arrange
  5  |   await page.goto("/workflows");
  6  | 
  7  |   // Act: Create Workflow
  8  |   await page
  9  |     .getByRole("button", {
  10 |       name: /create workflow/i,
  11 |     })
> 12 |     .click();
     |      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  13 | 
  14 |     console.log("Current URL:", page.url());
  15 | 
  16 |     console.log("PAGE:", await page.locator("body").innerText());
  17 | 
  18 |   // Confirm editor opened
  19 |   await expect(page).toHaveURL(/\/workflows\/.+/);
  20 | 
  21 |   // Act: add a node
  22 |   await page
  23 |     .getByRole("button", {
  24 |       name: /add node/i,
  25 |     })
  26 |     .click();
  27 | 
  28 |   await page
  29 |     .getByText("Manual Trigger", {
  30 |       exact: true,
  31 |     })
  32 |     .click();
  33 | 
  34 |   // Act: Save
  35 |   await page
  36 |     .getByRole("button", {
  37 |       name: /save/i,
  38 |     })
  39 |     .click();
  40 | 
  41 |   // Assert Save Result
  42 | 
  43 |   await expect(page.getByText("saved")).toBeVisible();
  44 | 
  45 |   // Reload the browser
  46 |   await page.reload();
  47 | 
  48 |   // Assert Persistence
  49 | 
  50 |   await expect(
  51 |     page.getByText("Manual Trigger", {
  52 |       exact: true,
  53 |     }),
  54 |   ).toBeVisible();
  55 | });
  56 | 
```