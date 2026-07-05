# Plan de Pruebas - Automatización Cypress CEGOS

## Objetivo
Validar los flujos críticos de autenticación y gestión de usuarios en la aplicación CEGOS con Cypress, cubriendo escenarios positivos y negativos.

## Alcance
- Login de administrador.
- Alta de usuario `Serghio Prueba`.
- Eliminación del usuario creado y re-adición del mismo.

## Criterios de entrada
- La aplicación debe estar disponible.
- El usuario administrador de prueba debe existir.
- El entorno debe permitir crear y eliminar usuarios.

## Criterios de salida
- Los 3 escenarios principales deben ejecutarse sin fallos en el caso Happy Path.
- Los casos Unhappy Path deben mostrar el comportamiento esperado de validación o rechazo.

## Casos de prueba

### 1. Login

| ID | Tipo | Caso | Precondición | Pasos | Resultado esperado |
|---|---|---|---|---|---|
| HP-LOGIN-01 | Happy Path | Ingreso con credenciales válidas | Usuario administrador disponible | 1. Abrir login. 2. Ingresar email y password válidos. 3. Enviar formulario. | El sistema autentica al usuario y muestra el módulo de Usuarios. |
| UP-LOGIN-01 | Unhappy Path | Ingreso con credenciales inválidas | Usuario en pantalla de login | 1. Abrir login. 2. Ingresar email válido y password incorrecta. 3. Enviar formulario. | El sistema rechaza el acceso y muestra mensaje de error. |

### 2. Alta de usuario

| ID | Tipo | Caso | Precondición | Pasos | Resultado esperado |
|---|---|---|---|---|---|
| HP-ALTA-01 | Happy Path | Crear usuario `Serghio Prueba` | Sesión autenticada | 1. Ir a Usuarios. 2. Abrir formulario Nuevo Usuario. 3. Registrar nombre, correo y contraseña. 4. Guardar. | El usuario queda visible en la grilla. |
| UP-ALTA-01 | Unhappy Path | Intentar crear el mismo usuario dos veces | Usuario ya creado | 1. Crear el usuario. 2. Repetir el alta con el mismo correo. | El sistema no debe duplicar el registro. |

### 3. Eliminación de usuario

| ID | Tipo | Caso | Precondición | Pasos | Resultado esperado |
|---|---|---|---|---|---|
| HP-ELIM-01 | Happy Path | Eliminar y volver a adicionar el usuario | Usuario visible en la grilla | 1. Ubicar el registro. 2. Pulsar eliminar. 3. Confirmar la eliminación. 4. Crear nuevamente el mismo usuario. | El usuario se elimina y luego queda nuevamente registrado. |
| UP-ELIM-01 | Unhappy Path | Intentar eliminar un registro inexistente | Usuario no presente en la grilla | 1. Buscar el registro. 2. Intentar acceder a la acción de borrado. | El sistema no permite borrar un registro inexistente. |

## Plan de ejecución sugerido
1. Ejecutar primero `HP-LOGIN-01` para validar acceso.
2. Ejecutar `HP-ALTA-01` y `UP-ALTA-01` para asegurar creación y control de duplicados.
3. Ejecutar `HP-ELIM-01` y `UP-ELIM-01` para validar borrado y no borrado.

## Evidencias esperadas
- Capturas de ejecución de Cypress.
- Resultado de `npm test` o `cypress run`.
- Registro de casos ejecutados y su estado.

## Automatización asociada
- [cypress/e2e/cegos.cy.js](../cypress/e2e/cegos.cy.js)
- [cypress/pages/LoginPage.js](../cypress/pages/LoginPage.js)
- [cypress/pages/UsersPage.js](../cypress/pages/UsersPage.js)
- [cypress/fixtures/usuarios.json](../cypress/fixtures/usuarios.json)