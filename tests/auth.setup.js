//@ts-check
import { test, expect } from "@playwright/test";
import path from "path";

test.use({ storageState: { cookies: [], origins: [] } });
const authFile = path.join(__dirname, "../playwright/.auth/user.json");
test("authentication", async ({ page }) => {
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
