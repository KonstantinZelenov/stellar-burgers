const INGREDIENT = '[data-cy="ingredient-item"]';
const MODAL = '[data-cy="modal"]';
const MODAL_CLOSE = '[data-cy="modal-close-button"]';
const MODAL_OVERLAY = '[data-cy="modal-overlay"]';
const ORDER_BUTTON = '[data-cy="order-submit-button"]';
const CONSTRUCTOR_ELEMENT = '[class*="constructor-element"]';

describe('Stellar Burgers Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'test-access-token');

    cy.visit('/');

    cy.wait('@getIngredients', { timeout: 10000 });
    cy.wait('@getUser', { timeout: 10000 });
    cy.get('li', { timeout: 10000 }).should('exist');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('1. Проверяет добавление ингредиентов', () => {
    cy.get(CONSTRUCTOR_ELEMENT).should('not.exist');
    cy.get(INGREDIENT).should('have.length.at.least', 5);

    cy.get(INGREDIENT)
      .contains('Краторная булка N-200i')
      .closest(INGREDIENT)
      .within(() => {
        cy.get('button').first().click();
      });

    cy.get(INGREDIENT)
      .contains('Биокотлета из марсианской Магнолии')
      .closest(INGREDIENT)
      .within(() => {
        cy.get('button').first().click();
      });

    cy.get(CONSTRUCTOR_ELEMENT)
      .contains('Краторная булка N-200i')
      .should('exist');

    cy.get(CONSTRUCTOR_ELEMENT)
      .contains('Биокотлета из марсианской Магнолии')
      .should('exist');
  });

  it('2. Проверяет модальное окно ингредиента', () => {
    cy.get(MODAL).should('not.exist');
    cy.get(INGREDIENT)
      .contains('Краторная булка N-200i')
      .should('exist')
      .click({ force: true });

    cy.get(MODAL, { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.contains('h3', 'Детали ингредиента').should('exist');
        cy.get(MODAL_CLOSE).should('exist').and('be.enabled');
      });

    cy.get(MODAL).within(() => {
      cy.contains('Краторная булка N-200i').should('exist');
      cy.contains('420').should('exist');
    });

    cy.get(MODAL_CLOSE).click();
    cy.get(MODAL).should('not.exist');
  });

  it('3. Проверяет закрытие через оверлей', () => {
    cy.get(MODAL).should('not.exist');

    cy.get(INGREDIENT)
      .contains('Краторная булка N-200i')
      .should('exist')
      .click({ force: true });

    cy.get(MODAL, { timeout: 10000 }).should('exist').and('be.visible');

    cy.get(MODAL_OVERLAY)
      .should('exist')
      .and('have.css', 'pointer-events', 'auto')
      .click({ force: true });
    cy.get(MODAL).should('not.exist');
  });

  it('4. Проверяет создание заказа', () => {
    cy.get('[data-cy="constructor-empty"]').should('exist');
    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');

    cy.get(INGREDIENT)
      .contains('Краторная булка N-200i')
      .parents(INGREDIENT)
      .find('button')
      .first()
      .click();

    cy.get('[data-cy="constructor-bun-top"]')
      .should('exist')
      .and('contain', 'Краторная булка N-200i');
    cy.get('[data-cy="constructor-bun-bottom"]')
      .should('exist')
      .and('contain', 'Краторная булка N-200i');

    cy.get(INGREDIENT)
      .contains('Биокотлета из марсианской Магнолии')
      .parents(INGREDIENT)
      .find('button')
      .first()
      .click();

    cy.get('[data-cy="constructor-ingredients"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );

    cy.get(ORDER_BUTTON).should('be.enabled').click();

    cy.wait('@createOrder', { timeout: 15000 });

    cy.get(MODAL)
      .first()
      .should('be.visible')
      .within(() => {
        cy.contains('идентификатор заказа').should('exist');
        cy.contains('12345').should('exist');
        cy.get(MODAL_CLOSE).first().click();
      });

    cy.get(MODAL).should('not.exist');

    cy.get('[data-cy="constructor-ingredients"]')
      .should('not.contain', 'Биокотлета из марсианской Магнолии')
      .and('contain', 'Выберите начинку');

    cy.get('[data-cy="constructor-empty"]').should('exist');
    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
  });
});
