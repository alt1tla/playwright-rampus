//@ts-check
import { test, expect } from "@playwright/test";
import path from "path";

test.use({ storageState: { cookies: [], origins: [] } });
const authFile = path.join(__dirname, "../playwright/.auth/user.json");

test.describe("authentication", () => {
  test("unathorized redirecting & check ui", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/auth/);
    await expect(page.getByRole("link", { name: "Рампус" })).toBeVisible();
    await expect(page.getByText("Логин или почта")).toBeVisible();
    await expect(page.getByText("Пароль")).toBeVisible();
    await expect(page.getByRole("button", { name: "Войти" })).toBeVisible();
    const registrationLink = page.getByRole("main").getByRole("link");
    await expect(registrationLink).toBeVisible();
    await registrationLink.click();
    await expect(page).toHaveURL(/reg/);
  });

  test("wrong data filled behavior", async ({ page }) => {
    await page.goto("/auth");
    const usernameField = await page.getByRole("textbox", {
      name: "Логин или почта",
    });
    const passwordFiled = await page.getByRole("textbox", { name: "Пароль" });
    const loginInButton = await page.getByRole("button", { name: "Войти" });
    const notifyTip = await page.locator("#auth__notify");

    await loginInButton.click();
    await expect(notifyTip).toHaveText("Все поля должны быть заполнены");

    await usernameField.fill("mayhem");
    await passwordFiled.fill("abracadabra");
    await loginInButton.click();
    await expect(notifyTip).toHaveText("Неверный логин, почта или пароль");
  });

  test("authenticate", async ({ page }) => {
    await page.goto("/auth");
    const usernameField = await page.getByRole("textbox", {
      name: "Логин или почта",
    });
    const passwordFiled = await page.getByRole("textbox", { name: "Пароль" });
    const loginInButton = await page.getByRole("button", { name: "Войти" });
    const notifyTip = await page.locator("#auth__notify");
    await usernameField.fill(String(process.env.LOGIN));
    await passwordFiled.fill(String(process.env.PASSWORD));
    await loginInButton.click();
    await expect(notifyTip).toHaveText(/Опа, это же/);
    await page.waitForURL("/profile");
    await page.context().storageState({ path: authFile });
  });
});
