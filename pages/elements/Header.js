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

    this.coursesMenu = page.locator(
      '<span class="cursor-pointer text-small text-ui-white">Все курсы</span>',
    );
    this.schoolsMenu = page.locator(
      '<span class="cursor-pointer text-small text-ui-white">Школы и Вузы</span>',
    );

    // Навигационные ссылки
    this.navigationLinks = {
      habr: page.locator('//a[text()="Хабр"]'),
      qa: page.locator('//a[text()="Q&A"]'),
      career: page.locator('//a[text()="Карьера"]'),
      courses: page.locator('//a[text()="Курсы"]'),
    };
  }

  async openCoursesMenu() {
    await this.clickCoursesDropdownButton();
    this.coursesDropdown = this.page
      .locator("div.shadow-context-menu-dropdown")
      .filter({ hasText: "Взрослым" });
    await expect(this.coursesDropdown).toBeVisible();
  }

  async clickCoursesMenuItemChildren(categoryName) {
    await this.page
      .locator(`a[href*="/courses-dlya-detej/direction"]`)
      .filter({ hasText: categoryName })
      .click();
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

  // проверяю направления курсов для детей в блоке "Все курсы" в хедере
  async assertNavigationToCourseCategoryChildren() {
    const categories = [
      [
        "Программирование",
        /\/courses-dlya-detej\/direction\/programmirovanie$/,
      ],
      ["Математика", /\/courses-dlya-detej\/direction\/matematika$/],
      ["Русский язык", /\/courses-dlya-detej\/direction\/russkiy-yazyk$/],
      ["Информатика", /\/courses-dlya-detej\/direction\/informatika$/],
      ["Английский язык", /\/courses-dlya-detej\/direction\/angliyskiy-yazyk$/],
      ["Физика", /\/courses-dlya-detej\/direction\/fizika$/],
    ];
    for (const [categoryName, expectedURL] of categories) {
      await this.openCoursesMenu();
      await this.clickCoursesMenuItemChildren(categoryName);
      await expect(this.page).toHaveURL(expectedURL);
    }
  }
}
