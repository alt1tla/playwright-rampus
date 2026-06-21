//@ts-check
import { test, expect } from "@playwright/test";
import { describe } from "node:test";

test.describe("check ui & redirecting", () => {
  test("info", async ({ page }) => {
    await page.goto("profile");
    const userAvatar = page.locator(".avatar");
    const userName = page.locator(".f-and-s-names-and-plat");
    const userNameOnlyTag = page.locator(".without-first-and-second-names");
    const userTag = page.locator(".username-copy");
    const userDesc = page.locator(".description");
    const userActions = page.locator(".div-show-three-dots-popup");
    const userActionsPopUp = page.locator(".three-dots-popup");
    const copyAction = page
      .locator("#three-dots-popup_user-info")
      .getByText("Копировать ссылку");
    const editAction = page
      .locator("#three-dots-popup_user-info")
      .getByRole("link", { name: "Редактировать" });
    const exitAction = page
      .locator("#three-dots-popup_user-info")
      .getByRole("link", { name: "Выйти" });

    await expect(userAvatar).toBeVisible();

    if ((await userNameOnlyTag.count()) == 0) {
      await expect(userName).toBeVisible();
    } else {
      await expect(userNameOnlyTag).toBeVisible();
      await userNameOnlyTag.click();
    }

    await expect(userTag).toBeVisible();
    await userTag.click();

    await expect(userDesc).toBeVisible();
    if (await userDesc.getAttribute("href")) {
      await userDesc.click();
      await expect(page).toHaveURL(/edit/);
      await page.goto("/profile");
    }

    await expect(userActions).toBeVisible();
    await userActions.click();

    await expect(userActionsPopUp).toBeVisible();
    await expect(copyAction).toBeVisible();
    await expect(editAction).toBeVisible();
    await expect(exitAction).toBeVisible();

    await copyAction.click();

    await userActions.click();
    await editAction.click();
    await expect(page).toHaveURL(/edit/);

    await page.goto("/profile");
    await userActions.click();
    await exitAction.click();
    await expect(page).toHaveURL(/auth/);
  });
  test("statictics", async ({ page }) => {
    await page.goto("profile");
    const friendsWidget = page.locator(".user-friends");
    const blossomWidget = page.getByRole("link", {
      name: "Цветение 0 1 уровень 0 /",
    });
    const trophiesWidget = page.getByRole("link", {
      name: "Трофеи Нет трофеев",
    });
    const profileCountersWidget = page.getByText("Показатели Посты 0").first();
    await expect(friendsWidget).toBeVisible();
    await expect(blossomWidget).toBeVisible();
    await expect(trophiesWidget).toBeVisible();
    await expect(profileCountersWidget).toBeVisible();

    await friendsWidget.click();
    await expect(page).toHaveURL(/friends/);
    await page.goto("/profile");

    await blossomWidget.click();
    await expect(page).toHaveURL(/blossom/);
    await page.goto("/profile");

    await trophiesWidget.click();
    await expect(page).toHaveURL(/trophies/);
    await page.goto("/profile");
  });
  test("sidebar", async ({ page }) => {
    await page.goto("/profile");
    const accountTab = page.locator(".menu-profile");
    const wallTab = page.getByRole("link", { name: "Стена" });
    const chatTab = page.getByRole("link", { name: "Чаты" });
    const trophieTab = page.getByRole("link", { name: "Полка" });
    const peopleTab = page.getByRole("link", { name: "Люди" });
    const settingTab = page.getByRole("link", { name: "Настройки" });
    const backTab = page.locator("#back");
    const exitTab = page.locator("#exit");

    await wallTab.click();
    await expect(page).toHaveURL(/wall/);
    await chatTab.click();
    await expect(page).toHaveURL(/chats/);
    await trophieTab.click();
    await expect(page).toHaveURL(/case/);
    await peopleTab.click();
    await expect(page).toHaveURL(/users/);
    await accountTab.click();
    await settingTab.click();
    await expect(page).toHaveURL(/edit/);
    await backTab.click();
    await exitTab.click();
    await expect(page).toHaveURL(/auth/);
  });
  [
    {
      title: "posts",
      name: "Посты",
      filter: "all",
      expected: "Все посты",
    },
    {
      title: "reposts",
      name: "Репосты",
      filter: "reposts",
      expected: "Все репосты",
    },
  ].forEach(({ title, name, filter, expected }) => {
    test(`${title}`, async ({ page }) => {
      await page.goto("/profile");
      const activeTab = page.getByText(`${name}`).first();
      const itemConteiner = page.locator("#success-render-posts");
      const item = page.locator(".user-post");
      const seeAllButton = page.locator("#see-all-posts");
      const tipText = "Увы, но вы ещё не сделали постов";

      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes(`/render-posts_profile`) &&
          response.status() === 200,
      );

      await expect(activeTab).toBeVisible();
      await activeTab.click();
      const response = await responsePromise;
      await expect(response.ok()).toBeTruthy();
      await expect(itemConteiner).toBeVisible();

      if ((await item.count()) == 0) {
        await expect(page.getByText(tipText)).toBeVisible();
      } else {
        const aLotOfPosts = await item.last().getAttribute("class");
        if (aLotOfPosts && aLotOfPosts.includes("hide")) {
          await expect(seeAllButton).toBeVisible();
        }
      }
    });
  });
});
