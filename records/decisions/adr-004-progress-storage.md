---
type: adr
id: ADR-004
title: "localStorage síncrono para el progreso, con degradación a memoria"
status: accepted
date: 2026-08-17
epic: e5
---

# ADR-004: localStorage síncrono para el progreso, con degradación a memoria

## Status

Accepted

## Context

`RF-09` exige que el registro de aciertos y fallos por hueso "conserve ese
registro entre sesiones en el mismo navegador, sin cuenta de usuario". El
observable es literal: responder, recargar la página, y que el registro del
hueso respondido siga ahí.

`must-privacy-006` acota el espacio de soluciones antes de empezar: el
progreso no sale del navegador —sin backend, sin telemetría, sin peticiones de
red en tiempo de ejecución—, así que cualquier opción con servidor está fuera
por decisión de proyecto, no por preferencia técnica.

El proyecto **no tiene hoy ninguna capa de almacenamiento**: un `grep` de
`localStorage`, `sessionStorage` e `indexedDB` sobre `src/` y `tests/` no
devuelve nada. Esta es la primera vez que algo tiene que sobrevivir a una
recarga, así que la decisión no se apoya en ningún precedente interno y sí
marca el precedente para lo que venga.

El volumen es conocido y diminuto: como mucho 206 entradas de dos contadores.
Del orden de unos pocos kilobytes en JSON, contra el límite práctico de 5 MB
de `localStorage`.

Options:

- **(A) `localStorage` con JSON síncrono** — API síncrona y trivial, soportada
  en todo navegador vigente, y del tamaño justo para 206 contadores. Falla en
  modo privado de algunos navegadores y cuando el usuario bloquea el
  almacenamiento: `getItem`/`setItem` pueden lanzar.
- **(B) `IndexedDB`** — asíncrono, transaccional, con capacidad muy superior y
  sin los problemas de cuota de `localStorage`. A cambio: API asíncrona que
  contagia `async` a todo lo que la toque, y una complejidad enorme frente a
  guardar 206 pares de enteros.
- **(C) Solo memoria, sin persistir** — no satisface `RF-09`. El observable del
  requisito es explícitamente la supervivencia a una recarga.
- **(D) `localStorage` con una abstracción de almacenamiento y `IndexedDB` de
  reserva** — cubre el caso de `localStorage` no disponible sin perder
  persistencia, al precio de dos implementaciones de la misma cosa.

## Decision

**Opción (A):** `localStorage`, serializando el registro completo a JSON bajo
una sola clave, tras un adaptador con una interfaz mínima
(leer / escribir / borrar) que el dominio no conoce.

Cuando `localStorage` no está disponible —modo privado, almacenamiento
bloqueado, cuota agotada— la aplicación **degrada a memoria**: el progreso
funciona durante la sesión y no sobrevive a la recarga, pero **nada se rompe y
nada se pierde en silencio dentro de la sesión**. La degradación es explícita
en el adaptador, no un `try/catch` disperso por la aplicación.

El registro se serializa entero en cada escritura, no por hueso. Con 206
entradas de dos enteros es más simple y no hay ningún dato que sugiera que
importe; si alguna vez importa, habrá una medición delante.

## Consequences

**Positive:**

- API síncrona: el dominio y los componentes siguen siendo síncronos, y las
  pruebas no necesitan `await` ni relojes falsos.
- El adaptador es lo bastante chico como para probarlo entero contra un doble
  en memoria, sin tocar el `localStorage` real en las pruebas unitarias.
- Cero dependencias nuevas, coherente con "sin cuenta, sin instalación, sin
  servidor" y con `must-privacy-006`, que queda satisfecho por construcción:
  no hay a dónde enviar nada.
- Marca un precedente barato para el próximo dato que deba persistir.

**Negative / costs:**

- En modo privado el progreso no sobrevive a la recarga. Aceptado: la
  alternativa que lo evita (D) duplica la implementación para un caso de borde
  en el que, además, el usuario ha pedido explícitamente no persistir nada.
- Serializar todo el registro en cada respuesta es O(n) sobre 206 entradas.
  Irrelevante a esta escala, y medible el día que deje de serlo.
- `localStorage` es por origen y por navegador: el progreso no viaja entre
  dispositivos. Es exactamente lo que `must-privacy-006` quiere, no un defecto.

## Alternatives considered

- **(B) `IndexedDB`:** rechazada por desproporción — contagiaría asincronía a
  todo el motor de test para guardar unos pocos kilobytes.
- **(C) Solo memoria:** rechazada — incumple el observable de `RF-09`.
- **(D) Doble backend con reserva:** rechazada por ahora — es el "rabbit hole"
  que el brief de la épica nombra explícitamente. Se reconsidera si aparece
  evidencia real de usuarios estudiando en modo privado y perdiendo progreso.
