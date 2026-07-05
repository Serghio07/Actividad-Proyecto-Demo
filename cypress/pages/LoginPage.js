class LoginPage {
  selectors = {
    email: 'input[wire\\:model="email"][type="email"]',
    password: 'input[wire\\:model="password"][type="password"]',
    submit: 'button[type="submit"]',
    errorMessage: 'Credenciales incorrectas'
  }

  visit() {
    cy.visit('/')
    return this
  }

  login(email, password) {
    this.visit()
    cy.get(this.selectors.email).should('be.visible').clear().type(email)
    cy.get(this.selectors.password)
      .should('be.visible')
      .clear()
      .type(password, { log: false })
    cy.contains(this.selectors.submit, 'Iniciar sesión')
      .should('be.enabled')
      .click()
    return this
  }

  verifySuccessfulLogin() {
    cy.contains(this.selectors.submit, 'Iniciar sesión').should('not.exist')
    cy.url().should('not.match', /login/i)
    cy.get('body').should('not.contain.text', this.selectors.errorMessage)
    return this
  }

  verifyLoginFailed() {
    cy.url().should('match', /login/i)
    cy.contains('button', 'Iniciar sesión').should('be.visible')
    cy.get('body').should('not.contain.text', 'Usuarios')
    return this
  }
}

export default new LoginPage()
