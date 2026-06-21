//@ts-check
import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });
test.describe("registration", () => {
  test("redirecting & check ui", async ({ page }) => {
    await page.goto("/reg");
    await expect(page.getByRole("textbox", { name: "Почта" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Логин" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Пароль" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Создать" })).toBeVisible();
    const loginLink = page.getByRole("main").getByRole("link");
    await loginLink.click();
    await expect(page).toHaveURL(/auth/);
  });

  test("incorrect-data behavior", async ({ page }) => {
    await page.goto("/reg");
    const emailField = page.locator("#reg__email");
    const loginField = page.getByRole("textbox", { name: "Логин" });
    const passwordField = page.getByRole("textbox", { name: "Пароль" });
    const singUpButton = page.getByRole("button", { name: "Создать" });
    const notifyTip = page.locator("#reg__notify");

    let response;
    const checkEmailResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/on-or-off_email") && resp.status() === 200,
    );
    const checkLoginResponsePromise = page.waitForResponse(
      (resp) => resp.url().includes("/on-or-off_id") && resp.status() === 200,
    );

    await singUpButton.click();
    await expect(notifyTip).toHaveText("Все поля должны быть заполнены");
    await expect(notifyTip).not.toContainClass("reject");

    await emailField.fill("lady");
    await singUpButton.click();
    await expect(emailField).toContainClass("off");
    await expect(notifyTip).toHaveText("Некорректная почта");
    await expect(notifyTip).not.toContainClass("reject");
    await emailField.clear();

    await emailField.fill("thisismy@mail.com");
    await emailField.press("Enter");
    response = await checkEmailResponsePromise;
    await expect(response.ok()).toBeTruthy();
    await expect(emailField).toContainClass("on");
    await singUpButton.click();
    await expect(notifyTip).not.toContainClass("reject");

    await loginField.fill("test");
    await singUpButton.click();
    await expect(loginField).toContainClass("off");
    await expect(notifyTip).toHaveText("Некорректный логин");
    await expect(notifyTip).not.toContainClass("reject");
    await loginField.clear();

    await loginField.fill("this_is_my_login-");
    await singUpButton.click();
    await expect(loginField).toContainClass("off");
    await expect(notifyTip).toHaveText("Некорректный логин");
    await expect(notifyTip).not.toContainClass("reject");
    await loginField.clear();

    await loginField.fill("this_is_my_login_");
    await singUpButton.click();
    await expect(loginField).toContainClass("off");
    await expect(notifyTip).toHaveText("Некорректный логин");
    await expect(notifyTip).not.toContainClass("reject");
    await loginField.clear();

    await loginField.fill("this_is_my_login");
    await loginField.press("Enter");
    response = await checkLoginResponsePromise;
    await expect(response.ok()).toBeTruthy();
    await expect(notifyTip).not.toContainClass("reject");
    await expect(loginField).toContainClass("on");
    await singUpButton.click();

    await passwordField.fill("barracuda");
    await singUpButton.click();
    await expect(passwordField).toContainClass("off");
    await expect(notifyTip).toHaveText("Некорректный пароль");
    await expect(notifyTip).not.toContainClass("reject");
    await passwordField.clear();

    await passwordField.fill("barracuda69");
    await singUpButton.click();
    await expect(passwordField).toContainClass("off");
    await expect(notifyTip).toHaveText("Некорректный пароль");
    await expect(notifyTip).not.toContainClass("reject");
    await passwordField.clear();

    await passwordField.fill("barracuda!");
    await singUpButton.click();
    await expect(passwordField).toContainClass("off");
    await expect(notifyTip).toHaveText("Некорректный пароль");
    await expect(notifyTip).not.toContainClass("reject");
    await passwordField.clear();
  });
});
