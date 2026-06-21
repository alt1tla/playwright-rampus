//@ts-check
import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });
test.describe("authorization", () => {
  test("unathorized redirecting & check ui", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Вход/)
    await expect(page).toHaveURL(/auth/);
    await expect(page.getByRole("link", { name: "Рампус" })).toBeVisible();
    await expect(page.locator("#email_or_username")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("#auth-button")).toBeVisible();
    const registrationLink = page.getByRole("main").getByRole("link");
    await expect(registrationLink).toBeVisible();
    await registrationLink.click();
    await expect(page).toHaveURL(/reg/);
  });

  test("incorrect-data behavior", async ({ page }) => {
    await page.goto("/auth");
    const usernameField = await page.locator("#email_or_username");
    const passwordFiled = await page.locator("#password");
    const loginInButton = await page.locator("#auth-button");
    const notifyTip = await page.locator("#auth__notify");

    await loginInButton.click();
    await expect(notifyTip).toHaveText("Все поля должны быть заполнены");

    await usernameField.fill("mayhem");
    await passwordFiled.fill("abracadabra");
    await loginInButton.click();
    await expect(notifyTip).toHaveText("Неверный логин, почта или пароль");
  });
});
