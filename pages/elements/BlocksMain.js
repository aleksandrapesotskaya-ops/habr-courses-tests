import { expect } from "@playwright/test";
// здесь будут только блоки "Популярные курсы", "Бесплатные курсы" и "Популярные школы" и все связанные с ними проверки

export class BlocksMain {
  constructor(page) {
    this.page = page;
    // блок Популярные курсы
    // табы направлений
    this.popularBlock = this.page.locator("section", {
      has: this.page.getByRole("heading", { name: "Популярные курсы" }),
    });
    const tabs = this.popularBlock.locator("button");
    this.tabAll = tabs.nth(0);
    this.tabSeconddirection = tabs.nth(1); // беру следующую белую кнопку после черной (выбранной) кнопки
    this.tabThirddirection = tabs.nth(2);
    this.tabFourthdirection = tabs.nth(3);
    this.tabFifthdirection = tabs.nth(4);

    this.ArrowButtonTabPopular = this.popularBlock
      .locator('xpath=.//button[contains(@class, "swiper-button")]')
      .last();
    this.goToallPopularCourses = page
      .locator('//a[contains(normalize-space(), "Перейти ко всем курсам")]')
      .first();
    // блок Бесплатные курсы
    // табы направлений
    this.freeBlock = page.locator(
      '//section[.//h2[normalize-space()="Бесплатные курсы"]]',
    );
    this.tabAllFree = this.freeBlock.locator(
      'xpath=.//button[normalize-space()="Все"]',
    );
    this.tabSeconddirectionFree = this.freeBlock.locator("(//button)[2]");
    this.ArrowButtonTabFree = this.freeBlock.locator(
      "button.swiper-button-shadow",
    );
    this.goToallFreeCourses = this.freeBlock.locator(
      'xpath=.//a[normalize-space()="Перейти ко всем курсам"]',
    );
  }

  // проверка, что по клику на "Все" и кнопке "Перейти ко всем курсам"
  // переходим на /courses
  async clicktabAllcourses() {
    await this.tabAll.click();
    const [newPage] = await Promise.all([
      this.page.waitForEvent("popup"),
      // кликаем на кнопку "Перейти ко всем курсам"
      this.goToallPopularCourses.click(),
    ]);
    await expect(newPage).toHaveURL(/courses/);
    await newPage.close();
  }

  // проверка, что перелистывание табов в блоке "Популярные курсы" работает
  async scrollArrowButtonTabPopular(tabName) {
    const tabPopular = this.popularBlock.locator(
      `//button[normalize-space()="${tabName}"]`,
    );
    const isVisible = await tabPopular.isVisible().catch(() => false);
    if (isVisible) {
      return;
    }
    for (let i = 0; i < 10; i++) {
      await this.ArrowButtonTabPopular.click();
      if (await tabPopular.isVisible().catch(() => false)) {
        break;
      }
    }
  }

  // проверка, что при выборе таба направления и нажатии кнопки "Перейти ко всем курсам" открывается новая вкладка
  // и в направлении предзаполнено выбранное направление из таба
  async checkClickTab(tabName) {
    const tabLocator = this.popularBlock.getByRole("button", {
      name: tabName,
    });
    await expect(tabLocator).toBeVisible();

    const selectedTabText = (await tabLocator.innerText()).trim();
    await tabLocator.click();

    const [newPage] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.goToallPopularCourses.click(),
    ]);
    await expect(newPage).toHaveURL(/courses/);
    await newPage.waitForLoadState("domcontentloaded");
    const directionInput = newPage
      .locator('//input[@placeholder="Какое направление?"]')
      .first();
    await expect(directionInput).toBeVisible();
    const inputValue = await directionInput.inputValue();
    expect(inputValue.trim()).toBe(selectedTabText.trim());
    await newPage.close();
  }

  // проверка, что карусель перелистывания карточек курсов в блоке
  // "Популярные курсы" бесконечная
  async checkInfiniteScroll() {
    const nextButton = this.popularBlock.locator(
      "button.swiper-button-shadow.absolute.-right-4",
    );
    await this.popularBlock
      .locator(".swiper-slide-active")
      .waitFor({ state: "visible" });

    const isOriginalSlide = async () => {
      const activeSlide = this.popularBlock.locator(".swiper-slide-active");
      const classes = await activeSlide.getAttribute("class");
      return !classes.includes("swiper-slide-duplicate");
    };

    const cards = this.popularBlock.locator('a[href*="page=courses"]');
    const getFirstVisibleHref = async () => {
      await cards.first().waitFor({ state: "attached" });
      return await cards.first().getAttribute("href");
    };

    while (!(await isOriginalSlide())) {
      await nextButton.click();
    }

    const initialIndex = await this.popularBlock
      .locator(".swiper-slide-active")
      .getAttribute("data-swiper-slide-index");

    let clickCount = 0;
    const maxClicks = 30;
    let completedFullLoop = false;

    while (clickCount < maxClicks && !completedFullLoop) {
      await nextButton.click();
      clickCount++;

      await this.page.waitForFunction(() => {
        const swiper = document.querySelector(".swiper-container")?.swiper;
        return swiper ? !swiper.animating : true;
      });

      const currentSlide = this.popularBlock.locator(".swiper-slide-active");
      const currentIndex = await currentSlide.getAttribute(
        "data-swiper-slide-index",
      );
      const isOriginal = !(await currentSlide.getAttribute("class")).includes(
        "duplicate",
      );

      if (currentIndex === initialIndex && isOriginal && clickCount > 1) {
        completedFullLoop = true;
      }
    }

    expect(completedFullLoop).toBeTruthy();
    expect(clickCount).toBeGreaterThan(1);
  }

  // проверка, что перелистывание табов в блоке "Бесплатные курсы" работает и
  // находится нужный таб с текстом
  async scrollArrowButtonTabFree(tabName) {
    const tabFree = this.freeBlock.locator(
      `//button[contains(text(), "${tabName}")]`,
    );
    const isVisible = await tabFree.isVisible();
    if (isVisible) {
      return;
    }
    for (let i = 0; i < 10; i++) {
      await this.ArrowButtonTabFree.click();
      if (await tabFree.isVisible().catch(() => false)) {
        break;
      }
    }
  }

  // проверка, что по клику на "Все" и кнопке "Перейти ко всем курсам" переходим
  // на /courses/besplatnye и в новой вкладке включен чек-бокс "Только бесплатные"
  async clicktabAllcoursesFree() {
    await this.tabAllFree.click();
    const [newPage] = await Promise.all([
      this.page.waitForEvent("popup"),
      // кликаем на кнопку "Перейти ко всем курсам"
      this.goToallFreeCourses.click(),
    ]);
    await expect(newPage).toHaveURL(/courses\/besplatnye(\/.*)?$/);
    const filterButton = newPage.locator(
      'button.bg-ui-blue-50:has(div:has-text("1"))',
    );
    const freeOnlyCheckbox = newPage.locator('input[name="freeOnly"]');
    await filterButton.click();
    await expect(freeOnlyCheckbox).toBeChecked();
    await newPage.close();
  }

  //  проверка, что при клике на таб направления в "Бесплатные курсы" и "Перейти ко всем курсам" откроется новая вкладка,
  // где предзаполнен дропдаун направления и включен чек-бокс "Только бесплатные"
  async checkClickTabFree(tabName) {
    const tabLocator = this.freeBlock.locator(
      `//button[contains(text(), "${tabName}")]`,
    );
    const selectedTabTextFree = (await tabLocator.innerText()).trim();
    await tabLocator.click();
    const [newPage] = await Promise.all([
      this.page.waitForEvent("popup"),
      this.goToallFreeCourses.click(),
    ]);
    await expect(newPage).toHaveURL(/courses\/besplatnye(\/.*)?$/);
    const filterButton = newPage.locator(
      'button.bg-ui-blue-50:has(div:has-text("1"))',
    );
    const freeOnlyCheckbox = newPage.locator('input[name="freeOnly"]');
    await filterButton.click();
    await expect(freeOnlyCheckbox).toBeChecked();
    const directionInput = newPage
      .locator('//input[@placeholder="Какое направление?"]')
      .first();
    await expect(directionInput).toBeVisible();
    const inputValue = await directionInput.inputValue();
    expect(inputValue.trim()).toBe(selectedTabTextFree.trim());
    await expect(freeOnlyCheckbox).toBeChecked();
    await newPage.close();
  }

  // проверка, что карусель перелистывания карточек курсов в блоке
  // "Бесплатные курсы" бесконечная
  async checkInfiniteScrollFree() {
    const nextButton = this.freeBlock.locator(
      "button.swiper-button-shadow.absolute.-right-4",
    );
    await this.freeBlock
      .locator(".swiper-slide-active")
      .waitFor({ state: "visible" });

    const isOriginalSlide = async () => {
      const activeSlide = this.freeBlock.locator(".swiper-slide-active");
      const classes = await activeSlide.getAttribute("class");
      return !classes.includes("swiper-slide-duplicate");
    };

    const cards = this.freeBlock.locator('a[href*="page=courses"]');
    const getFirstVisibleHref = async () => {
      await cards.first().waitFor({ state: "attached" });
      return await cards.first().getAttribute("href");
    };

    while (!(await isOriginalSlide())) {
      await nextButton.click();
    }

    const initialIndex = await this.freeBlock
      .locator(".swiper-slide-active")
      .getAttribute("data-swiper-slide-index");

    let clickCount = 0;
    const maxClicks = 30;
    let completedFullLoop = false;

    while (clickCount < maxClicks && !completedFullLoop) {
      await nextButton.click();
      clickCount++;

      await this.page.waitForFunction(() => {
        const swiper = document.querySelector(".swiper-container")?.swiper;
        return swiper ? !swiper.animating : true;
      });

      const currentSlide = this.freeBlock.locator(".swiper-slide-active");
      const currentIndex = await currentSlide.getAttribute(
        "data-swiper-slide-index",
      );
      const isOriginal = !(await currentSlide.getAttribute("class")).includes(
        "duplicate",
      );

      if (currentIndex === initialIndex && isOriginal && clickCount > 1) {
        completedFullLoop = true;
      }
    }

    expect(completedFullLoop).toBeTruthy();
    expect(clickCount).toBeGreaterThan(1);
  }
}
