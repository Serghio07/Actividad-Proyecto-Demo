class UsersPage {
  selectors = {
    name: 'input[wire\\:model="name"]',
    email: 'input[wire\\:model="email"][type="email"]',
    password: 'input[wire\\:model="password"][type="password"]',
    editButton: 'button[title="Editar"]',
    deleteButton: 'button[title="Eliminar"]',
    confirmDeleteButton: 'button[wire\\:click="delete"]'
  }

  clickButtonByText(text) {
    cy.get('body').then(($body) => {
      const buttons = [...$body.find('button')]
      const targetButton = buttons.find((button) => button.innerText.trim() === text)

      expect(targetButton, `button with text ${text}`).to.exist
      cy.wrap(targetButton).click({ force: true })
    })

    return this
  }

  open() {
    cy.location('pathname').then((pathname) => {
      if (!pathname.includes('/users')) {
        cy.contains(/^Usuarios$/i).should('be.visible').click()
      }
    })
    cy.contains('button', 'Nuevo Usuario').should('be.visible')
    return this
  }

  rowByEmail(email) {
    return cy.contains('tr', email, { matchCase: false }).should('exist')
  }

  createIfNotExists(user) {
    cy.get('body').then(($body) => {
      const exists = $body.text().toLowerCase().includes(user.email.toLowerCase())

      if (!exists) {
        this.clickButtonByText('Nuevo Usuario')
        cy.get(this.selectors.name).filter(':visible').clear().type(user.name)
        cy.get(this.selectors.email).filter(':visible').clear().type(user.email)
        cy.get(this.selectors.password)
          .filter(':visible')
          .clear()
          .type(user.password, { log: false })
        this.clickButtonByText('Crear Usuario')
      }
    })

    this.verifyUserExists(user.email)
    return this
  }

  createUser(user) {
    this.clickButtonByText('Nuevo Usuario')
    cy.get(this.selectors.name).filter(':visible').clear().type(user.name)
    cy.get(this.selectors.email).filter(':visible').clear().type(user.email)
    cy.get(this.selectors.password)
      .filter(':visible')
      .clear()
      .type(user.password, { log: false })
    this.clickButtonByText('Crear Usuario')
    return this
  }

  editNameByEmail(email, updatedName) {
    this.rowByEmail(email)
      .find(this.selectors.editButton)
      .should('be.visible')
      .click()
    cy.get(this.selectors.name)
      .filter(':visible')
      .should('be.visible')
      .clear()
      .type(updatedName)
    cy.contains('button', 'Actualizar').should('be.enabled').click()
    return this
  }

  verifyUserExists(email) {
    this.rowByEmail(email).should('contain.text', email)
    return this
  }

  verifyUpdatedName(email, updatedName) {
    this.rowByEmail(email).should('contain.text', updatedName)
    return this
  }

  deleteUserByEmail(email) {
    this.rowByEmail(email)
      .find(this.selectors.deleteButton)
      .scrollIntoView()
      .should('exist')
      .click()
    cy.get(this.selectors.confirmDeleteButton).should('exist').click({ force: true })
    return this
  }

  verifyUserNotExists(email) {
    cy.contains('tr', email, { matchCase: false }).should('not.exist')
    return this
  }

  verifyUserCount(email, expectedCount) {
    cy.get('table tbody tr').then(($rows) => {
      const matchingRows = [...$rows].filter((row) => row.innerText.toLowerCase().includes(email.toLowerCase()))

      expect(matchingRows).to.have.length(expectedCount)
    })

    return this
  }

  verifyAdministratorIsPresent(email) {
    cy.get('body').should('contain.text', email)
    return this
  }
}

export default new UsersPage()
