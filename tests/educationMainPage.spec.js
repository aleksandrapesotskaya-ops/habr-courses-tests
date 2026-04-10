import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";
import { BlocksMain } from "../pages/elements/BlocksMain";

test.describe.configure({ mode: "parallel" });

test("Главная страница образования", async ({ page }) => {
  const mainPage = new MainPage(page);
  const blocksMain = new BlocksMain(page);

  await test.step("Переходим на страницу /education", async () => {
    await mainPage.goto();
  });

  await test.step('проверяем заголовок страницы "Выберите онлайн обучение"', async () => {
    await mainPage.assertPageTitle();
  });

  await test.step("проверяем, что в Хабр курсы вшита ссылка", async () => {
    await mainPage.assertHabrCoursesLink();
  });

  // раскрываем меню по клику на шеврон, проверяем, что открывается меню
  await test.step("проверяем шеврон справа от Хабр курсы", async () => {
    await mainPage.header.clickHabrCoursesDropdownButton();
    await mainPage.header.checkHabrCoursesMenuVisible();
  });

  // проверяем, что клик по Все сервисы Хабра никуда не ведет (нет ссылки)
  await test.step('Проверяем, что "Все сервисы Хабра" не имеет ссылки', async () => {
    await mainPage.assertAllServicesLinkHasNoHref();
  });

  // проверяем, что Хабр, Q&A, Карьера, Курсы - это ссылки
  await test.step("проверяем навигационные ссылки в хедере", async () => {
    await mainPage.header.checkNavigationLinks();
  });

  // проверяем, что по повторному клику меню не видно
  await test.step("Проверяем скрытие меню Хабр Курсы", async () => {
    await mainPage.assertMenuToggle(0);
  });

  // открываем "Все курсы" по клику на шеврон
  await test.step("Проверяем меню Все курсы", async () => {
    await mainPage.openCoursesMenu();
    await mainPage.assertCoursesMenuVisible();
  });

  // проверяем популярные курсы
  await test.step("Проверяем ссылку Популярные курсы", async () => {
    await mainPage.assertPopularCoursesLink();
  });

  // проверяем категории курсов
  await test.step("Проверяем категорию Программирование и IT", async () => {
    await mainPage.assertNavigationToCourseCategory(
      "Программирование и IT",
      /\/programmirovanie$/,
    );
  });

  await test.step("Проверяем категорию Аналитика и Data Science", async () => {
    await mainPage.assertNavigationToCourseCategory(
      "Аналитика и Data Science",
      /\/analitika$/,
    );
  });

  await test.step("Проверяем категорию Дизайн и контент", async () => {
    await mainPage.assertNavigationToCourseCategory(
      "Дизайн и контент",
      /\/dizajn$/,
    );
  });

  await test.step("Проверяем категорию Маркетинг и продажи", async () => {
    await mainPage.assertNavigationToCourseCategory(
      "Маркетинг и продажи",
      /\/marketing$/,
    );
  });

  await test.step("Проверяем категорию Финансы и бухгалтерия", async () => {
    await mainPage.assertNavigationToCourseCategory(
      "Финансы и бухгалтерия",
      /\/finansy$/,
    );
  });

  // проверяем "Посмотреть все"
  await test.step("Проверяем ссылку Посмотреть все", async () => {
    await mainPage.assertViewAllCoursesLink();
  });

  // проверяем скрытие меню со всеми курсами
  await test.step("Проверяем скрытие меню Все курсы", async () => {
    await mainPage.openCoursesMenu();
    await mainPage.assertCoursesMenuVisible();
    await mainPage.openCoursesMenu();
    await mainPage.assertCoursesMenuHidden();
  });

  // проверяем меню "Школы и Вузы"
  await test.step("Проверяем меню Школы и Вузы", async () => {
    await mainPage.assertSchoolsAndUniversitiesMenu();
  });

  // проверяем скрытие меню "Школы и Вузы"
  await test.step("Проверяем скрытие меню Школы и Вузы", async () => {
    await mainPage.assertMenuToggle(2);
  });

  // проверка кнопки "Найти курсы"
  await test.step("Проверяем кнопку Найти курсы", async () => {
    await mainPage.assertSearchButton();
  });

  // проверка плейсхолдеров в поиске
  await test.step("Проверяем поля ввода для поиска курсов", async () => {
    await mainPage.assertSearchInputs();
  });

  // проверка дропдауна "Какое направление?"
  await test.step("Проверяем дропдаун выбора направления", async () => {
    await mainPage.assertDirectionDropdown();
  });

  // проверка дропдауна "Что изучить?"
  await test.step("Проверяем дропдаун выбора навыка (Что изучить)", async () => {
    await mainPage.assertSkillDropdown();
  });

  // проверка дропдауна "Какая цель?"
  await test.step("Проверяем дропдаун выбора цели (Какая цель)", async () => {
    await mainPage.assertGoalDropdown();
  });

  await test.step("Проверяем работу стрелки для перелистывания табов в Популярных курсах", async () => {
    await blocksMain.scrollArrowButtonTabPopular("Хобби и творчество");
  });

  await test.step("Проверяем, что при клике на таб Все и Перейти ко всем курсам переходим на courses", async () => {
    await blocksMain.clicktabAllcourses();
  });

  await test.step("Проверяем, что при клике на таб и 'Перейти ко всем курсам' открывается новая вкладка, на которой предзаполнен дропдаун 'Какое направление?'", async () => {
    await blocksMain.checkClickTab("Программирование и IT");
  });
  await test.step("Проверяем, что при клике на таб и 'Перейти ко всем курсам' открывается новая вкладка, на которой предзаполнен дропдаун 'Какое направление?'", async () => {
    await blocksMain.checkClickTab("Аналитика и Data science");
  });
  await test.step("Проверяем, что при клике на таб и 'Перейти ко всем курсам' открывается новая вкладка, на которой предзаполнен дропдаун 'Какое направление?'", async () => {
    await blocksMain.checkClickTab("Дизайн и контент");
  });
  await test.step("Проверяем, что при клике на таб и 'Перейти ко всем курсам' открывается новая вкладка, на которой предзаполнен дропдаун 'Какое направление?'", async () => {
    await blocksMain.checkClickTab("Бизнес и менеджмент");
  });

  await test.step("Проверяем, что баннер ИИ ведет на /courses/analitika/ai", async () => {
    await mainPage.checkBannerAi();
  });

  await test.step("Проверяем, что карусель перелистывания карточек в 'Популярных курсах' бесконечная", async () => {
    await blocksMain.checkInfiniteScroll();
  });

  await test.step("Проверяем работу стрелки для перелистывания табов в Бесплатных курсах", async () => {
    await blocksMain.scrollArrowButtonTabFree("Хобби и творчество");
  });

  await test.step("Проверяем, что по клику на таб Все и Перейти ко всем курсам переходим на /courses/besplatnye и включен чек-бокс 'Только бесплатные'", async () => {
    await blocksMain.clicktabAllcoursesFree();
  });

  await test.step("Проверяем, что по клику на таб направления, Перейти ко всем курсам переходим на /courses/besplatnye, на новой странице предзаполнен дропдаун направления и включен чек-бокс 'Только бесплатные'", async () => {
    await blocksMain.checkClickTabFree("Программирование и IT");
  });

  await test.step("Проверяем, что карусель перелистывания карточек курсов в 'Беслпатных курсах' бесконечная", async () => {
    await blocksMain.checkInfiniteScrollFree();
  });

  await test.step("Проверяем, что при клике на таб 'Детям' урл меняется на /education#school", async () => {
    await mainPage.checkTabforChildren();
  });

  await test.step("Проверяем, что при клике на таб 'промокоды' открывается новая вкладка с промокодами", async () => {
    await mainPage.checkTabPromocodes();
  });
});
