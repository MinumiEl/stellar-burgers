/// <reference types="cypress" />

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const MODAL = '[data-testid="modal"]';

describe('Проверка страницы конструктора бургера', () => {
  beforeEach(() => {
    // Настраиваем перехваты (Инцепты)
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');

    // Визит на страницу и ожидание загрузки данных
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Тестирование сборки бургера', () => {
    it('должен добавлять булки и ингредиенты в конструктор', () => {
      // Ищем ингредиент и жмем кнопку "Добавить"
      cy.contains(BUN_NAME).parents('li').find('button').click();
      cy.contains(MAIN_NAME).parents('li').find('button').click();

      // Проверяем, что в конструкторе появились выбранные позиции
      cy.get('[data-testid="constructor-container"]')
        .should('contain', BUN_NAME)
        .and('contain', MAIN_NAME);
    });
  });

  describe('Тестирование модальных окон', () => {
    it('должен открывать и закрывать модалку ингредиента', () => {
      cy.contains(BUN_NAME).click();
      cy.get(MODAL).should('be.visible').and('contain', BUN_NAME);

      // Закрытие по клику на крестик
      cy.get('[data-testid="modal-close"]').click();
      cy.get(MODAL).should('not.exist');

      // Закрытие по клику на оверлей
      cy.contains(BUN_NAME).click();
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      cy.get(MODAL).should('not.exist');
    });
  });

  describe('Процесс создания заказа', () => {
    it('должен успешно оформлять заказ и очищать конструктор', () => {
      // Мокаем ответ на создание заказа
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('postOrder');

      // Подставляем токены авторизации
      cy.setCookie('accessToken', 'mock-access');
      window.localStorage.setItem('refreshToken', 'mock-refresh');

      // Собираем бургер
      cy.contains(BUN_NAME).parents('li').find('button').click();
      cy.contains(MAIN_NAME).parents('li').find('button').click();

      // Жмем «Оформить заказ»
      cy.get('button').contains('Оформить заказ').click();

      // Проверяем модалку заказа
      cy.wait('@postOrder');
      cy.get(MODAL).should('be.visible');
      cy.get('[data-testid="order-number"]').should('have.text', '12345');

      // Закрываем модалку
      cy.get('[data-testid="modal-close"]').click();
      cy.get(MODAL).should('not.exist');

      // Проверяем, что конструктор пуст (согласно extraReducers в твоем слайсе)
      cy.get('[data-testid="constructor-container"]').should('not.contain', BUN_NAME);
      cy.get('[data-testid="constructor-container"]').should('not.contain', MAIN_NAME);
    });
  });
});
