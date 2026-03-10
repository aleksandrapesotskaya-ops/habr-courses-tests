const { test, expect } = require("@playwright/test");

class BurgerMenuPage {
  constructor(page) {
    this.page = page;

    // Хедер
    this.header = page.locator("header");
    this.habrCoursesTitle = page.getByText("Хабр курсы", { exact: true });

    // Шеврон
    this.chevronButton = page.getByRole("banner").locator("button").first();

    this.dropdown = page
      .locator("header .shadow-context-menu-dropdown")
      .first();
    this.servicesDescription = this.dropdown.getByText("Все сервисы Хабра", {
      exact: true,
    });

    // Ссылки
    this.habrLink = this.dropdown.getByRole("link", { name: "Хабр" });
    this.qandaLink = this.dropdown.getByRole("link", { name: "Q&A" });
    this.careersLink = this.dropdown.getByRole("link", { name: "Карьера" });
    this.coursesLink = this.dropdown.getByRole("link", { name: "Курсы" });

    this.allMenuLinks = this.dropdown.locator("a");
  }

  async setup() {
    await this.page.goto("/education", { waitUntil: "domcontentloaded" });
    await expect(this.header).toBeVisible();
  }

  async cleanup() {
    if (await this.dropdown.isVisible()) {
      await this.toggleMenu(false);
    }
  }

  async toggleMenu(shouldBeOpen = true) {
    const isVisible = await this.dropdown.isVisible();

    if (shouldBeOpen !== isVisible) {
      await this.chevronButton.click();
      await this.page.waitForTimeout(100);
    }

    if (shouldBeOpen) {
      await expect(this.servicesDescription).toBeVisible({ timeout: 5000 });
    } else {
      await expect(this.servicesDescription).not.toBeVisible();
    }
  }

  getLinksConfig() {
    return [
      {
        element: this.habrLink,
        expectedDomain: "habr.com",
        name: "Хабр",
      },
      {
        element: this.qandaLink,
        expectedDomain: "qna.habr.com",
        name: "Q&A",
      },
      {
        element: this.careersLink,
        expectedDomain: "career.habr.com",
        name: "Карьера",
      },
      {
        element: this.coursesLink,
        expectedDomain: "career.habr.com/education",
        name: "Курсы",
      },
    ];
  }

  async isHeaderVisible() {
    return this.header.isVisible();
  }

  async checkHabrCoursesTitle() {
    await expect(this.habrCoursesTitle).toBeVisible();
    await expect(this.habrCoursesTitle).toHaveText("Хабр курсы");
  }

  async checkChevronVisible() {
    await expect(this.chevronButton).toBeVisible();
  }

  async checkServicesDescription() {
    await expect(this.servicesDescription).toBeVisible();
    await expect(this.servicesDescription).toHaveText("Все сервисы Хабра");
    await expect(this.servicesDescription).not.toHaveAttribute("href");
  }

  // Проверяем переход по ссылкам

  async checkAllLinksWithUrls() {
    const links = this.getLinksConfig();

    for (const link of links) {
      await expect(link.element).toBeVisible();
      await expect(link.element).toHaveAttribute("href");

      const href = await link.element.getAttribute("href");
      await test.step(`Проверяем ссылку ${link.name}`, async () => {
        await expect(link.element).toBeVisible();
        await expect(link.element).toHaveAttribute("href");

        const href = await link.element.getAttribute("href");

        expect(href).toContain(link.expectedDomain);
      });
    }

    await expect(this.allMenuLinks).toHaveCount(links.length);
  }

  async verifyLinksNavigation() {
    const links = this.getLinksConfig();

    for (const link of links) {
      await test.step(`Переход по ссылке: ${link.name}`, async () => {
        const target = await link.element.getAttribute("target");

        if (target === "_blank") {
          // Обработка новой вкладки
          const [newPage] = await Promise.all([
            this.page.context().waitForEvent("page"),
            link.element.click(),
          ]);

          await newPage.waitForLoadState("domcontentloaded");
          expect(newPage.url()).toContain(link.expectedDomain);
          await newPage.close();
        } else {
          await Promise.all([
            this.page.waitForNavigation({ waitUntil: "domcontentloaded" }),
            link.element.click(),
          ]);

          expect(this.page.url()).toContain(link.expectedDomain);
          await this.page.goBack({ waitUntil: "domcontentloaded" });
        }

        // Снова открываем меню
        await this.toggleMenu(true);
      });
    }
  }

  async verifyLinksAreWorking() {
    const links = await this.allMenuLinks.all();
    expect(links.length).toBe(4);

    for (const link of links) {
      const href = await link.getAttribute("href");
      const text = await link.textContent();

      expect(href).toBeTruthy();

      const absoluteUrl = new URL(href, this.page.url()).toString();

      const response = await this.page.request.get(absoluteUrl);
      const status = response.status();

      expect(
        [200, 301, 302, 304],
        `Ссылка "${text.trim()}" вернула статус ${status}`,
      ).toContain(status);
    }
  }

  async checkHoverEffect(linkElement) {
    const before = await linkElement.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );

    await linkElement.hover();

    const after = await linkElement.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );

    expect(after).not.toBe(before);
  }

  // Проверка закрытия меню

  async checkMenuCloses() {
    await this.toggleMenu(false);
  }
}

module.exports = { BurgerMenuPage };
