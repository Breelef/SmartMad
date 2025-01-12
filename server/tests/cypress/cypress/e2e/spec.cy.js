const baseUrl = "http://localhost:3000";

//cy.get('#txtNumberPersons') //For ID
//cy.get('input[value="xxx"]') //For some input value, for instance: name="xxx" or placeholder="xxx"
//cy.get('.cprValue') //For class

describe('Login Page - Element Presence Check', () => {

  it('should display all login elements', () => {
    cy.visit(baseUrl + '/login');
    cy.get('input[name="email"]')
      .should('be.visible');

    cy.get('input[name="password"]')
      .should('be.visible')
      .should('have.attr', 'placeholder', 'Enter your password');

    cy.contains('button', 'Login')
      .should('be.visible')
      .should('not.be.disabled');

    cy.get('div.mt-4')
      .should('be.visible')
      .contains('Google');

    cy.get('p.text-red-500')
      .should('not.exist');

    cy.contains('h1', 'SmartOpskrift').should('be.visible');
    cy.contains('h2', 'Login').should('be.visible');
  });
});

describe('Signup Page, wrong login', () => {

  it('should show an error message when email is not entered', () => {
    cy.visit(baseUrl + '/login');
    cy.get('form').submit();

    cy.get('input[name="email"]')
      .parent()
      .should('contain', 'Email is required');
  });

  it('should show an error message for invalid email format', () => {
    cy.visit(baseUrl + '/login');
    
  
    cy.get('input[name="email"]')
      .type('invalid-email')
      .blur(); 

    cy.get('input[name="email"]')
      .parent()
      .should('contain', 'Invalid email address');
  });
});

describe('Test Login and Actions', () => {
  it("Should complete a Full happy path", () => {
    cy.session('admin-session', () => {
      cy.login('admin@admin.com', 'admin123');
    });

    cy.visit(baseUrl + "/udfyld-til-opskrift");
    cy.wait(1000);
    cy.url().should('include', '/udfyld-til-opskrift');

    cy.get('input[placeholder="Tilføj din egen mulighed"]')
      .type('tomato')
      .type('{enter}');
    cy.get('input[placeholder="Tilføj din egen mulighed"]')
      .clear()
      .type('potato')
      .type('{enter}');
    cy.get('input[placeholder="Tilføj din egen mulighed"]')
      .clear()
      .type('chicken')
      .type('{enter}');

    cy.wait(500);

    cy.get('button')
      .contains('Send Opskrift')
      .should('be.visible')
      .should('not.be.disabled')
      .click({ force: true })
      .click();

    cy.wait(1000);

    cy.url({ timeout: 30000 }).should('include', '/find-opskrift');

    cy.get('.w-80 .flex.flex-col.gap-6').should('be.visible');
    cy.get('.w-80 .flex.flex-col.gap-6 button')
      .eq(1)
      .click();

    cy.get('button')
      .contains('Lav denne opskrift med kokken')
      .should('be.visible')
      .click();

    cy.get('input[placeholder="Spørg kokken!"]')
      .should('be.visible')
      .type('Hej, jeg vil gerne have hjælp med den her opskrift!');


    cy.get('button[type="submit"]')
      .contains('Send')
      .should('be.visible')
      .click();

    cy.wait(500);

    cy.get('.flex-1.overflow-auto .p-4')
      .last()
      .should('contain.text', 'Hej, jeg vil gerne have hjælp med den her opskrift!');
  });

});
