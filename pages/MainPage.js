import { expect } from "@playwright/test";
import { Header } from "./elements/header";

export class MainPage {
  constructor(page) {
    this.page = page;
    this.header = new Header(page);

    this.pageTitle = page.locator(
      '//h1[normalize-space()="Выберите онлайн-обучение"]',
    );
    this.directionDropdown = page.locator(".align-center.flex").first();
    this.suggestionsResults = page
      .locator(
        "//div[contains(@class, 'simplebar-content')][.//div[@role='listitem']]",
      )
      .first();
    this.searchCoursesButton = page.getByRole("button", {
      name: "Найти курсы",
    });
    this.skillInput = page.locator('//input[@placeholder="Что изучить?"]');
    this.suggestionsSkillsResults = page
      .locator(
        "//div[contains(@class, 'simplebar-content-wrapper')][@tabindex='0'][.//div[@role='listitem']]",
      )
      .first();

    this.goalDropdown = page
      .locator('//input[@placeholder="Какая цель?"]')
      .first();

    this.suggestionsGoalResults = page
      .locator(
        "//div[contains(@class, 'simplebar-content-wrapper')][@tabindex='0'][.//div[@role='listitem']]",
      )
      .first();

    this.directionInput = page.getByRole("textbox", {
      name: "Какое направление?",
    });
    this.skillInput = page.getByRole("textbox", { name: "Что изучить?" });
    this.goalInput = page.getByRole("textbox", { name: "Какая цель?" });
  }

  async goto() {
    await this.page.goto("/education");
  }
  async openCoursesMenu() {
    await this.header.clickCoursesDropdownButton();
  }

  async assertPageTitle() {
    await expect.soft(this.pageTitle).toBeVisible();
  }

  async assertHabrCoursesLink() {
    const linkHabrCourses = this.page.getByRole("link", { name: "Хабр Курсы" });
    await expect.soft(linkHabrCourses).toHaveAttribute("href", "/education");
  }

  async assertNavigationLink(linkName, expectedUrl) {
    const link = this.page.locator(`//a[text()="${linkName}"]`);
    await expect.soft(link).toHaveAttribute("href");

    // Дополнительно проверяем что ссылка ведет куда нужно
    if (expectedUrl) {
      await link.click();
      await expect(this.page).toHaveURL(expectedUrl);
    }
  }

  async assertAllServicesLinkHasNoHref() {
    await expect
      .soft(this.page.getByText("Все сервисы Хабра"))
      .not.toHaveAttribute("href");
  }

  async assertCoursesMenuHidden() {
    await expect(
      this.page.locator("div.shadow-context-menu-dropdown:visible"),
    ).toHaveCount(0);
  }

  async assertCoursesMenuVisible() {
    await expect(
      this.page.locator("div.shadow-context-menu-dropdown:visible"),
    ).toBeVisible();
  }

  async clickCoursesMenuItem(menuItemName) {
    await this.page
      .getByRole("banner")
      .getByRole("link", { name: menuItemName })
      .click();
  }

  async assertNavigationToCourseCategory(categoryName, expectedUrl) {
    await this.openCoursesMenu();
    await this.clickCoursesMenuItem(categoryName);
    await expect(this.page).toHaveURL(expectedUrl);
  }

  async assertPopularCoursesLink() {
    const linkPopularCourses = this.page
      .locator('a[href="/courses"]')
      .filter({ hasText: "Посмотреть все" });
    await expect(linkPopularCourses).toBeVisible();

    await Promise.all([
      this.page.waitForURL(/\/courses$/),
      linkPopularCourses.click(),
    ]);
  }

  async assertViewAllCoursesLink() {
    await this.openCoursesMenu();
    await expect(
      this.page.locator("div.shadow-context-menu-dropdown:visible"),
    ).toBeVisible();
    await this.page
      .locator(
        '//a[@href="/courses" and .//p[normalize-space()="Посмотреть все"]]',
      )
      .click();
    await expect(this.page).toHaveURL(/\/courses$/);
  }

  async assertViewAllCoursesLinkChildren() {
    await this.openCoursesMenu();
    await this.page
      .locator(
        '//a[@href="/courses-dlya-detej" and .//p[normalize-space()="Посмотреть все"]]',
      )
      .click();
    await expect(this.page).toHaveURL(/\/courses-dlya-detej$/);
  }

  async assertSchoolsAndUniversitiesMenu() {
    const menuItems = [
      { name: "Образовательные учреждения", url: /\/education_centers$/ },
      { name: "Рейтинг школ и вузов", url: /\/education_centers\/rating$/ },
      {
        name: "Отзывы о курсах и программах",
        url: /\/education_centers\/otzyvy$/,
      },
      { name: "Промокоды и акции", url: /\/education\/promocodes$/ },
    ];

    for (const item of menuItems) {
      await this.goto();
      await this.header.clickSchoolsAndUniversitiesDropdownButton();

      await expect(
        this.page.locator("div.shadow-context-menu-dropdown:visible"),
      ).toBeVisible();

      await this.assertSchoolsMenuItem(item.name, item.url);
    }
  }

  async assertSchoolsMenuItem(itemName, expectedUrl) {
    const menuSchoolsUniversities = this.page.locator(
      `//div[contains(@class,'shadow-context-menu-dropdown')]//a[.//p[contains(normalize-space(.), "${itemName.split(" ")[0]}")]]`,
    );

    await expect(menuSchoolsUniversities).toBeVisible();
    await Promise.all([
      this.page.waitForURL(expectedUrl),
      menuSchoolsUniversities.click(),
    ]);
  }

  async assertSearchButton() {
    await this.searchCoursesButton.click();
    await expect(this.page).toHaveURL(/courses/);
  }

  async assertSearchInputs() {
    await expect(this.directionInput).toBeVisible();
    await expect(this.skillInput).toBeVisible();
    await expect(this.goalInput).toBeVisible();
  }

  async assertDirectionDropdown() {
    await this.directionDropdown.click();
    await expect(this.suggestionsResults).toBeVisible();
  }

  async assertSkillDropdown() {
    await this.skillInput.click();
    await expect(this.suggestionsSkillsResults).toBeVisible();
  }

  async assertGoalDropdown() {
    await this.goalDropdown.click();
    await expect(this.suggestionsGoalResults).toBeVisible();
  }

  async assertMenuToggle(menuIndex) {
    const buttonSchools = this.page.locator(
      '//*[text()="Школы и Вузы"]/following-sibling::button',
    );
    const menuLocator = this.page.locator(
      "div.shadow-context-menu-dropdown:visible",
    );
    await buttonSchools.click();
    await expect(menuLocator).toBeVisible();

    await buttonSchools.click();
    await expect(menuLocator).toBeHidden();
  }
  // проверка, что клик по баннеру "Искусственный интеллект" ведет на /courses/analitika/ai
  async checkBannerAi() {
    const bannerAi = this.page.locator('a[href="/courses/analitika/ai"]');

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      bannerAi.click(),
    ]);
    await expect(newPage).toHaveURL(/courses\/analitika\/ai/);
    await newPage.close();
  }
  // проверка, что клик по табу "детям" меняет настоящий урл на #school
  async checkTabforChildren() {
    const tabForChildren = this.page.locator(
      '//a[text()="Детям" and @href="/education#school"]',
    );
    await expect(tabForChildren).toBeVisible();
    await tabForChildren.click();
    await expect(this.page).toHaveURL("/education#school");
  }
  // проверка, что по клику на таб "Промокоды" открывается новая вкладка /education/promocodes
  async checkTabPromocodes() {
    const tabPromocodes = this.page.locator(
      '//a[text()="Промокоды" and @href="/education/promocodes" and @target="_blank"]',
    );
    await expect(tabPromocodes).toBeVisible();
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      tabPromocodes.click(),
    ]);
    await expect(newPage).toHaveURL(/education\/promocodes/);
    await newPage.close();
  }
}
