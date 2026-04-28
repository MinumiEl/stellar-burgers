/// <reference types="cypress" />

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const MODAL = '[data-testid="modal"]';

describe('Проверка страницы конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Тестирование сборки бургера', () => {
    it('должен добавлять булки и ингредиенты в конструктор', () => {
      cy.contains(BUN_NAME).parents('li').find('button').click();
      cy.contains(MAIN_NAME).parents('li').find('button').click();
      cy.get('[data-testid="constructor-container"]')
        .should('contain', BUN_NAME)
        .and('contain', MAIN_NAME);
    });
  });

  describe('Тестирование модальных окон', () => {
    it('должен открывать и закрывать модалку ингредиента', () => {
      cy.contains(BUN_NAME).click();
      cy.get(MODAL).should('be.visible').and('contain', BUN_NAME);
      cy.get('[data-testid="modal-close"]').click();
      cy.get(MODAL).should('not.exist');
      cy.contains(BUN_NAME).click();
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      cy.get(MODAL).should('not.exist');
    });
  });

  describe('Процесс создания заказа', () => {
    it('должен успешно оформлять заказ и очищать конструктор', () => {
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('postOrder');
      cy.setCookie('accessToken', 'mock-access');
      window.localStorage.setItem('refreshToken', 'mock-refresh');
      cy.contains(BUN_NAME).parents('li').find('button').click();
      cy.contains(MAIN_NAME).parents('li').find('button').click();
      cy.get('button').contains('Оформить заказ').click();
      cy.wait('@postOrder');
      cy.get(MODAL).should('be.visible');
      cy.get('[data-testid="order-number"]').should('have.text', '12345');
      cy.get('[data-testid="modal-close"]').click();
      cy.get(MODAL).should('not.exist');

      cy.get('[data-testid="constructor-container"]').should('not.contain', BUN_NAME);
      cy.get('[data-testid="constructor-container"]').should('not.contain', MAIN_NAME);
    });
  });
});
