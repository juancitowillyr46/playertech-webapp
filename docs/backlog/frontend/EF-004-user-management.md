# FE-004 Gestión de Usuarios

## Objetivo

Permitir administrar usuarios de plataforma y usuarios administrativos del tenant.

## Problema que Resuelve

El sistema requiere controlar identidades, roles y estado operativo desde la interfaz.

## Valor de Negocio

Habilita gobierno de accesos y operación segura por contexto.

## Actores

* Super Admin
* Platform Admin
* Tenant Owner
* Academy Admin

## Dominios Involucrados

* Identity
* User
* Role
* Academy

## Historias de Usuario

* HU-001 Crear usuario root o de plataforma.
* HU-002 Listar usuarios de plataforma.
* HU-003 Crear usuario administrativo por invitación.
* HU-004 Reenviar invitación.
* HU-005 Activar cuenta y definir contraseña.
* HU-006 Actualizar usuario.
* HU-007 Desactivar usuario.
* HU-008 Reactivar usuario.
* HU-009 Consultar usuarios del tenant.
* HU-010 Crear owner/admin inicial del tenant.

## Reglas de UX Relacionadas

* No mezclar usuarios root y tenant en la misma vista sin contexto.
* Mostrar estado del usuario con claridad.
* Diferenciar invitado, activo e inactivo.

## Estado

Draft.

