# FE-001 Auth y Acceso

## Objetivo

Permitir que el usuario ingrese, salga y recupere su sesión en la aplicación.

## Problema que Resuelve

Sin una capa de acceso clara, el frontend no puede separar navegación pública y privada ni aplicar contexto de usuario.

## Valor de Negocio

Habilita el uso seguro de la plataforma y la entrada a los flujos de negocio.

## Actores

* Super Admin
* Tenant Owner
* Academy Admin
* Staff

## Dominios Involucrados

* Auth
* Identity
* Academy

## Historias de Usuario

* HU-001 Iniciar sesión.
* HU-002 Cerrar sesión.
* HU-003 Recuperar acceso o rehidratar sesión.
* HU-004 Redirigir según rol y contexto.
* HU-005 Mostrar una pantalla de ingreso clara y consistente con el signup.

## Reglas de UX Relacionadas

* Mostrar error claro ante credenciales inválidas.
* Diferenciar sesión de plataforma y sesión tenant.
* Redirigir a la vista correcta según el rol.
* Mantener una experiencia visual coherente entre signup y signin.
* Guiar al usuario no técnico con etiquetas y mensajes simples.

## Fuera de Alcance

* MFA.
* SSO.
* Recuperación avanzada de cuenta.

## Estado

Draft.
