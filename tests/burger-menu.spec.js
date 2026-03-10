const { test, expect } = require("@playwright/test");
const { BurgerMenuPage } = require("../pages/BurgerMenuPage");

test.describe("Левое меню с сервисами Хабра", () => {
  let menuPage;

  test.beforeEach(async ({ page }) => {
    menuPage = new BurgerMenuPage(page);
    await menuPage.setup();
  });

  test("Проверка открытия и закрытия меню", async () => {
    await menuPage.toggleMenu(true);
    await menuPage.toggleMenu(false);
  });

  test('Проверка описания "Все сервисы Хабра"', async () => {
    await menuPage.toggleMenu(true);
    await menuPage.checkServicesDescription();
  });

  test("Проверка всех ссылок (текст и URL)", async () => {
    await menuPage.toggleMenu(true);
    await menuPage.checkAllLinksWithUrls();
  });

  test("Проверка переходов по ссылкам", async () => {
    await menuPage.toggleMenu(true);
    await menuPage.verifyLinksNavigation();
  });

  test("Проверка что ссылки рабочие (HTTP статус)", async () => {
    await menuPage.toggleMenu(true);
    await menuPage.verifyLinksAreWorking();
  });

  test("Проверка подсветки при наведении", async () => {
    await menuPage.toggleMenu(true);

    const links = [
      menuPage.habrLink,
      menuPage.qandaLink,
      menuPage.careersLink,
      menuPage.coursesLink,
    ];

    for (const link of links) {
      await menuPage.checkHoverEffect(link);
    }
  });

  test("Полная проверка меню", async () => {
    await menuPage.toggleMenu(true);

    await menuPage.checkServicesDescription();
    await menuPage.checkAllLinksWithUrls();

    const links = [
      menuPage.habrLink,
      menuPage.qandaLink,
      menuPage.careersLink,
      menuPage.coursesLink,
    ];

    for (const link of links) {
      await menuPage.checkHoverEffect(link);
    }

    await menuPage.toggleMenu(false);
  });
});
