import { test, expect } from "@playwright/test";
import { MainPage } from "../pages/MainPage";
import { BlocksMain } from "../pages/elements/BlocksMain";

test.describe.configure({ mode: "parallel" });

test.describe("Главная страница образования", () => {
  let mainPage;
  let blocksMain;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    blocksMain = new BlocksMain(page);

    await mainPage.goto();
  });

  test.describe("Хедер", () => {
    test("проверяем заголовок страницы 'Выберите онлайн обучение'", async () => {
      await mainPage.assertPageTitle();
    });

    test("проверяем, что в Хабр курсы вшита ссылка", async () => {
      await mainPage.assertHabrCoursesLink();
    });

    // раскрываем меню по клику на шеврон, проверяем, что открывается меню
    test("проверяем шеврон справа от Хабр курсы", async () => {
      await mainPage.header.clickHabrCoursesDropdownButton();
      await mainPage.header.checkHabrCoursesMenuVisible();
      await mainPage.assertMenuToggle(0);
    });

    // проверяем, что клик по Все сервисы Хабра никуда не ведет (нет ссылки)
    test('Проверяем, что "Все сервисы Хабра" не имеет ссылки', async () => {
      await mainPage.assertAllServicesLinkHasNoHref();
    });

    // проверяем, что Хабр, Q&A, Карьера, Курсы - это ссылки
    test("проверяем навигационные ссылки в хедере", async () => {
      await mainPage.header.checkNavigationLinks();
    });
  });

  // открываем "Все курсы" по клику на шеврон
  test.describe("Меню 'Все курсы'", () => {
    test.afterEach(async () => {
      // закрываю меню после каждого теста
      await mainPage.openCoursesMenu();
    });
    test("меню Все курсы открывается и закрывается", async () => {
      await mainPage.openCoursesMenu();
      await mainPage.assertCoursesMenuVisible();
      await mainPage.openCoursesMenu();
      await mainPage.assertCoursesMenuHidden();
    });

    // проверяем популярные курсы
    test("Проверяем ссылку Популярные курсы", async () => {
      await mainPage.openCoursesMenu();
      await mainPage.assertPopularCoursesLink();
    });

    // проверяем "Посмотреть все"
    test("Проверяем ссылку Посмотреть все", async () => {
      await mainPage.assertViewAllCoursesLink();
    });

    // проверяем категории курсов
    const categories = [
      ["Программирование и IT", /\/programmirovanie$/],
      ["Аналитика и Data Science", /\/analitika$/],
      ["Дизайн и контент", /\/dizajn$/],
      ["Маркетинг и продажи", /\/marketing$/],
      ["Финансы и бухгалтерия", /\/finansy$/],
    ];

    for (const [name, url] of categories) {
      test(`Категория курсов: ${name}`, async () => {
        await mainPage.assertNavigationToCourseCategory(name, url);
      });
    }
  });

  // проверяем меню "Школы и Вузы"
  test.describe("Проверяем меню Школы и Вузы", () => {
    test("Меню открывается", async () => {
      await mainPage.assertSchoolsAndUniversitiesMenu();
    });

    // проверяем скрытие меню "Школы и Вузы"
    test("Проверяем скрытие меню Школы и Вузы", async () => {
      await mainPage.assertMenuToggle(2);
    });
  });

  // проверка кнопки "Найти курсы"
  test.describe("Проверяем поиск курсов, дропдауны", () => {
    test("Кнопка 'Найти курсы' при пустых дропдаунах ведет на витрину курсов", async () => {
      await mainPage.assertSearchButton();
    });

    // проверка плейсхолдеров в поиске
    test("Проверяем поля ввода для поиска курсов", async () => {
      await mainPage.assertSearchInputs();
    });

    // проверка дропдауна "Какое направление?"
    test("Проверяем дропдаун выбора направления", async () => {
      await mainPage.assertDirectionDropdown();
    });

    // проверка дропдауна "Что изучить?"
    test("Проверяем дропдаун выбора навыка (Что изучить)", async () => {
      await mainPage.assertSkillDropdown();
    });

    // проверка дропдауна "Какая цель?"
    test("Проверяем дропдаун выбора цели (Какая цель)", async () => {
      await mainPage.assertGoalDropdown();
    });
  });

  test.describe("Блок 'Популярные курсы'", () => {
    test("Проверяем работу стрелки для перелистывания табов в Популярных курсах", async () => {
      await blocksMain.scrollArrowButtonTabPopular("Хобби и творчество");
    });

    test("Проверяем, что при клике на таб Все и Перейти ко всем курсам переходим на courses", async () => {
      await blocksMain.clicktabAllcourses();
    });

    const tabs = [
      "Программирование и IT",
      "Аналитика и Data science",
      "Дизайн и контент",
      "Бизнес и менеджмент",
    ];

    for (const tab of tabs) {
      test(`Проверяем, что при клике на таб: ${tab} открывается новая вкладка, на которой заполнен дропдаун "Какое направление?"`, async () => {
        await blocksMain.checkClickTab(tab);
      });
    }

    test("Проверяем, что карусель перелистывания карточек в Популярных курсах зациклена", async () => {
      await blocksMain.checkInfiniteScroll();
    });
  });

  test.describe("Бесплатные курсы", () => {
    test("Проверяем работу стрелки для перелистывания табов в Бесплатных курсах", async () => {
      await blocksMain.scrollArrowButtonTabFree("Хобби и творчество");
    });

    test("Проверяем, что по клику на таб Все и Перейти ко всем курсам переходим на /courses/besplatnye и включен чек-бокс 'Только бесплатные'", async () => {
      await blocksMain.clicktabAllcoursesFree();
    });

    test("Проверяем, что по клику на таб направления, Перейти ко всем курсам переходим на /courses/besplatnye, на новой странице предзаполнен дропдаун направления и включен чек-бокс 'Только бесплатные'", async () => {
      await blocksMain.checkClickTabFree("Программирование и IT");
    });

    test("Проверяем, что карусель перелистывания карточек курсов в 'Бесплатных курсах' зациклена", async () => {
      await blocksMain.checkInfiniteScrollFree();
    });

    test.describe("Баннер ИИ, таб 'детям', таб 'промокоды'", () => {
      test("Проверяем, что баннер ИИ ведет на /courses/analitika/ai", async () => {
        await mainPage.checkBannerAi();
      });

      test("Проверяем, что при клике на таб 'Детям' урл меняется на /education#school", async () => {
        await mainPage.checkTabforChildren();
      });

      test("Проверяем, что при клике на таб 'промокоды' открывается новая вкладка с промокодами", async () => {
        await mainPage.checkTabPromocodes();
      });

      test("Проверяем, что при клике на Посмотреть все в блоке Детям открывается детская витрина курсов", async () => {
        await mainPage.assertViewAllCoursesLinkChildren();
      });
    });
  });
});
