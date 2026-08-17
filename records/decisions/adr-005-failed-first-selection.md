---
type: adr
id: ADR-005
title: "Selección ponderada por fallos, no cola estricta ni repetición espaciada"
status: accepted
date: 2026-08-17
epic: e5
---

# ADR-005: Selección ponderada por fallos, no cola estricta ni repetición espaciada

## Status

Accepted

## Context

El outcome del proyecto dice "el sistema sabe en qué huesos falla el estudiante
y **puede preguntarle esos primero**", y el backlog resume E5 como "selección de
preguntas que prioriza los huesos fallados". El `RF-09` del PRD, en cambio,
solo exige el registro persistente: la priorización viene del outcome y del
backlog, no de un observable numérico escrito en el requisito.

Hoy `pickTestableBone` elige uniformemente entre los huesos con geometría y solo
excluye el inmediato anterior. Su propio comentario ya deja escrito dónde encaja
esto: *"no prioriza huesos fallados: eso es `RF-09`/E5, fuera de esta
historia"*. Es una función pura en dominio, sin React ni DOM, y su aleatoriedad
está en una sola línea.

"Priorizar lo fallado" admite varias lecturas con consecuencias muy distintas
para cómo se siente estudiar.

Options:

- **(A) Ponderación por fallos** — cada hueso preguntable recibe un peso que
  crece con sus fallos y decrece con sus aciertos; se sortea con esos pesos.
  Lo fallado sale mucho más seguido, pero todo el catálogo sigue siendo
  alcanzable.
- **(B) Cola estricta de fallados** — mientras haya huesos fallados sin
  recuperar, solo se pregunta de esa cola; el resto del catálogo espera. La
  lectura más literal de "preguntar esos primero".
- **(C) Cajas de Leitner / repetición espaciada** — niveles con intervalos
  temporales, promoción y degradación por resultado. El estándar de la
  literatura de memorización.
- **(D) No priorizar, solo registrar** — cumple `RF-09` al pie de la letra y
  deja el outcome sin cumplir.

## Decision

**Opción (A):** ponderación. `pickTestableBone` recibe el registro de progreso
además del catálogo y sortea con pesos derivados de él, manteniendo la
exclusión del hueso inmediato anterior que ya tiene.

La aleatoriedad se **inyecta** en vez de llamar a `Math.random` por dentro, para
que la regla de ponderación se pueda probar de forma determinista: con un
sorteo fijo, un hueso fallado tres veces tiene que salir antes que uno nunca
fallado, y eso es una aserción, no una impresión.

## Consequences

**Positive:**

- El catálogo entero sigue alcanzable: un estudiante que falló diez huesos
  temprano no queda encerrado en esos diez, que es lo que haría (B). Estudiar
  sigue cubriendo material nuevo.
- La regla es una función pura de `(registro, catálogo, sorteo)`, así que la
  métrica *lagging* de la épica —"un hueso fallado vuelve antes que uno nunca
  fallado"— se puede afirmar con una prueba determinista.
- Extiende `pickTestableBone` en vez de reemplazarlo: la exclusión del anterior,
  el filtro por geometría y el caso degenerado ya probados siguen valiendo.
- Sin reloj: no hay fechas, ni husos horarios, ni "qué pasa si el estudiante
  vuelve en tres semanas" — todo lo que (C) arrastra.

**Negative / costs:**

- "Primero" es estadístico, no garantizado: puede salir un hueso nunca fallado
  aunque haya fallados pendientes. Es el precio de no encerrar el estudio, y el
  outcome dice "puede preguntarle esos primero", no "solo esos".
- Los pesos concretos son un juicio, no una derivación: se eligen simples y
  explicables, y se corrigen con uso real si hiciera falta. Un número inventado
  y no medido ya costó trabajo en s1 — aquí queda declarado como juicio, no
  disfrazado de medición.
- Sin componente temporal, un hueso acertado hace un mes cuenta igual que uno
  acertado hace un minuto. Aceptado: es exactamente la complejidad que (C)
  agrega y que el brief nombra como "rabbit hole".

## Alternatives considered

- **(B) Cola estricta:** rechazada — encierra el estudio en lo ya fallado y
  frena el avance por material nuevo, que es la mitad del propósito de la
  aplicación.
- **(C) Repetición espaciada:** rechazada por tamaño y por alcance — un
  planificador con intervalos es varias veces la épica y el brief lo excluye
  explícitamente. Se reconsidera si aparece un requisito que hable de
  *cuándo* repasar, no solo de *qué*.
- **(D) Solo registrar:** rechazada — cumpliría el `RF-09` literal dejando sin
  cumplir el outcome "el fallo dirige el estudio", que es la razón de ser de
  la épica.
