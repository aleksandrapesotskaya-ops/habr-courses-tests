import { expect } from "@playwright/test";

export class Header {
  constructor(page) {
    this.page = page;

    // Кнопки дропдаунов
    this.habrCoursesDropdownButton = page.locator(
      '//header//a[@title="Хабр Курсы"]/../button',
    );
    this.coursesDropdownButton = page.getByRole("button").nth(1);
    this.schoolsDropdownButton = page.getByRole("button").nth(2);

    // Элементы дропдаунов
    this.habrCoursesDropdownItem = page.locator(
      '//header//div[contains(@class, "shadow-context-menu-dropdown")]//div[text()="Все сервисы Хабра"]/../../a',
    );

    this.coursesMenu = page.locator("div.shadow-context-menu-dropdown").nth(1);
    this.schoolsMenu = page.locator("div.shadow-context-menu-dropdown").nth(2);

    // Навигационные ссылки
    this.navigationLinks = {
      habr: page.locator('//a[text()="Хабр"]'),
      qa: page.locator('//a[text()="Q&A"]'),
      career: page.locator('//a[text()="Карьера"]'),
      courses: page.locator('//a[text()="Курсы"]'),
    };
  }

  async checkNavigationLinks() {
    for (const [name, link] of Object.entries(this.navigationLinks)) {
      await expect
        .soft(link, `Ссылка "${name}" должна иметь атрибут href`)
        .toHaveAttribute("href");
    }
  }

  async clickHabrCoursesDropdownButton() {
    await expect(
      this.habrCoursesDropdownButton,
      'Дропдаун "Хабр Курсы" не найден в хедере',
    ).toBeVisible();
    await this.habrCoursesDropdownButton.click();
  }

  async clickCoursesDropdownButton() {
    await this.coursesDropdownButton.click();
  }

  async clickSchoolsAndUniversitiesDropdownButton() {
    await this.schoolsDropdownButton.click();
  }

  async checkHabrCoursesMenuVisible() {
    await expect(
      this.page.locator("div.shadow-context-menu-dropdown").first(),
    ).toBeVisible();
    await expect(this.page.getByText("Все сервисы Хабра")).toBeVisible();
  }

  async checkHabrCoursesMenuHidden() {
    await expect(
      this.page.locator("div.shadow-context-menu-dropdown").first(),
    ).toBeHidden();
  }

  async assertionHabrCoursesDropdownItem(itemName, link) {
    await expect
      .soft(
        this.habrCoursesDropdownItem.filter({ hasText: itemName }),
        `Элемент "${itemName}" не найден в дропдауне`,
      )
      .toHaveAttribute("href", link);
  }

  async clickHabrCoursesDropdownItem(itemName) {
    await this.habrCoursesDropdownItem.filter({ hasText: itemName }).click();
  }

  async clickDropdownButton(buttonName) {
    const buttonLocator = this.page.locator(
      `//header//div//span[text()="${buttonName}"]/../button`,
    );

    await expect(
      buttonLocator,
      `Дропдаун "${buttonName}" не найден в хедере`,
    ).toBeVisible();

    await buttonLocator.click();
  }
}
