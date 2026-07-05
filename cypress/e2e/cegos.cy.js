import loginPage from '../pages/LoginPage'
import usersPage from '../pages/UsersPage'

describe('CEGOS - Login', () => {
  let administrador
  let usuario

  before(() => {
    cy.fixture('usuarios').then((datos) => {
      administrador = datos.administrador
      usuario = datos.nuevoUsuario
    })
  })

  it('HP-LOGIN-01 - Ingresa con credenciales válidas', () => {
    loginPage.login(administrador.email, administrador.password)
    loginPage.verifySuccessfulLogin()
    cy.contains('Usuarios').should('be.visible')
  })

  it('UP-LOGIN-01 - Rechaza credenciales inválidas', () => {
    loginPage.login(administrador.email, 'password-invalida')
    loginPage.verifyLoginFailed()
    cy.contains('button', 'Iniciar sesión').should('be.visible')
  })
})

describe('CEGOS - Alta de usuario', () => {
  let administrador
  let usuario

  before(() => {
    cy.fixture('usuarios').then((datos) => {
      administrador = datos.administrador
      usuario = datos.nuevoUsuario
    })
  })

  beforeEach(() => {
    loginPage.login(administrador.email, administrador.password)
    loginPage.verifySuccessfulLogin()
    usersPage.open()
  })

  it('HP-ALTA-01 - Crea el usuario Serghio Prueba', () => {
    usersPage.createIfNotExists(usuario)
    usersPage.verifyUserExists(usuario.email)
    usersPage.verifyUserCount(usuario.email, 1)
  })

  it('UP-ALTA-01 - No duplica el usuario si se intenta crear otra vez', () => {
    usersPage.createIfNotExists(usuario)
    usersPage.createUser(usuario)
    usersPage.verifyUserCount(usuario.email, 1)
  })
})

describe('CEGOS - Eliminación de usuario', () => {
  let administrador
  let usuario

  before(() => {
    cy.fixture('usuarios').then((datos) => {
      administrador = datos.administrador
      usuario = datos.nuevoUsuario
    })
  })

  beforeEach(() => {
    loginPage.login(administrador.email, administrador.password)
    loginPage.verifySuccessfulLogin()
    usersPage.open()
  })

  it('HP-ELIM-01 - Elimina el usuario y lo vuelve a adicionar', () => {
    usersPage.createIfNotExists(usuario)
    usersPage.deleteUserByEmail(usuario.email)
    usersPage.verifyUserNotExists(usuario.email)
    usersPage.createUser(usuario)
    usersPage.verifyUserExists(usuario.email)
    usersPage.verifyUserCount(usuario.email, 1)
  })

  it('UP-ELIM-01 - No permite eliminar un registro inexistente', () => {
    const emailInexistente = 'usuario.inexistente.cegos@example.com'

    usersPage.verifyUserNotExists(emailInexistente)
    cy.contains('tr', emailInexistente, { matchCase: false }).should('not.exist')
  })
})
