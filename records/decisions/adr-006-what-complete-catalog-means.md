---
type: adr
id: ADR-006
title: "Una entrada con razón de ausencia documentada cuenta como catálogo completo"
status: accepted
date: 2026-08-17
epic: e6
---

# ADR-006: Una entrada con razón de ausencia documentada cuenta como catálogo completo

## Status

Accepted

## Context

`RF-08` define el catálogo completo y se declara **condición de lanzamiento del
producto**: "no se publica una versión con el catálogo incompleto". Su
observable dice que una prueba automática "cuenta 206 entradas, verifica que no
hay nombres ni identificadores duplicados, y verifica que **toda entrada tiene
una región gráfica existente en el esqueleto**".

Medido sobre el código el 2026-08-17, el catálogo tiene **206 entradas**, el
reparto por región coincide con el desglose canónico, no hay duplicados, y
**199 de las 206 tienen geometría**. Las siete restantes —los seis huesecillos
del oído medio (martillo, yunque y estribo, de ambos lados) y el hioides—
tienen `meshName: null` y una razón escrita de por qué:

> "No articula con ningún otro hueso —queda suspendido en el cuello por
> músculos y ligamentos— y el modelo del esqueleto no lo incluye."

Eso no es un descuido pendiente: ADR-001 punto 4 lo decidió el 2026-08-16 —
"se declaran como excepción explícita en el catálogo. Riesgo asumido por
decisión del proyecto; no se cubren en e1". La coletilla *"en e1"* dejó la
puerta abierta, y esta épica es donde vence.

El resultado es que **la condición de lanzamiento es hoy imposible de cumplir
por construcción**, y lo es en silencio: el PRD afirma un observable que
ninguna prueba comprueba, y las pruebas que sí existen afirman otra cosa
(`ancla 199 entradas a la geometría del modelo`, `declara exactamente 7
ausencias`). Un requisito que nadie puede satisfacer no protege nada: se
ignora, y con él se erosiona la costumbre de tomarse en serio los demás.

Options:

- **(A) Conseguir geometría para los siete.** Cumple `RF-08` al pie de la
  letra. Exige un activo secundario con su licencia, integrarlo a un catálogo
  cuya fuente de verdad es otro modelo (ADR-001 punto 2), y vistas propias —los
  osículos y el hioides no son visibles en ninguna vista externa del esqueleto,
  que es justo la razón por la que faltan—. Es una épica entera, no un arreglo.
- **(B) Redefinir "completo" como cobertura del catálogo, no del modelo.** Una
  entrada está completa cuando tiene nombre en español, término en Terminologia
  Anatomica, sinónimos, región anatómica y **o bien** una malla **o bien** una
  razón documentada de su ausencia. El catálogo cubre los 206 huesos del
  esqueleto adulto; el modelo 3D cubre 199 de ellos, y el catálogo lo dice.
- **(C) Quitar las siete entradas** para que 199 sea el total. Hace cuadrar la
  aritmética destruyendo el dato: el esqueleto adulto tiene 206 huesos, y un
  estudiante que busque el estribo tiene que encontrarlo.
- **(D) Dejar `RF-08` como está** y no lanzar. Es el estado actual, tomado por
  omisión y no por decisión.

## Decision

**Opción (B).** "Catálogo completo" significa que las 206 entradas del
esqueleto adulto existen y están completas **como entradas de catálogo**. La
geometría es un atributo del activo 3D, no de la entrada: una entrada sin malla
está completa si dice por qué no la tiene.

En consecuencia:

1. El observable de `RF-08` en el PRD pasa a exigir que toda entrada tenga
   geometría **o** una razón de ausencia documentada, y que ninguna quede sin
   una de las dos.
2. La prueba de integridad afirma ese criterio de forma explícita, en vez de
   afirmarlo de refilón repartido en dos pruebas que hablan de 199 y de 7.
3. Los siete ausentes siguen en el catálogo, con su razón, y la aplicación
   sigue mostrándola donde corresponde.

**Esto no revoca ADR-001**, lo completa: aquél asumió el riesgo y lo dejó
abierto "en e1"; éste lo cierra diciendo qué significa convivir con él.

**Y no cierra la opción (A).** Si algún día aparece un requisito de estudiar el
oído medio, la geometría de los siete es una épica que este catálogo ya sabe
recibir: cambiar `meshName: null` por un nombre de malla es el único cambio de
datos que haría falta.

## Consequences

**Positive:**

- La condición de lanzamiento pasa a ser **verdadera y comprobable**. Hoy el
  proyecto no puede lanzar por una regla que ya había decidido no cumplir.
- El PRD deja de afirmar un observable que ninguna prueba verifica. Un requisito
  y su gate vuelven a decir lo mismo.
- El dato anatómico se conserva íntegro: los 206 huesos siguen ahí, buscables y
  explicados, incluidos los que no se pueden señalar.
- El criterio queda en **una** prueba con nombre propio, en vez de deducirse de
  dos que hablan de números sueltos.

**Negative / costs:**

- La aplicación se publica sabiendo que siete huesos no se pueden ver ni
  preguntar en el modo test. Es real y es visible para el estudiante, que lee
  la razón en la ficha.
- "Completo" pasa a significar algo más matizado que el uso coloquial, y hay
  que explicarlo cada vez que alguien nuevo lea `RF-08`. Se mitiga escribiéndolo
  en el propio requisito, no solo aquí.
- Si mañana se consigue la geometría, `RF-08` habrá que volver a tocarlo. Es
  barato y sería una buena noticia.

## Alternatives considered

- **(A) Conseguir la geometría:** diferida, no rechazada — es una épica propia
  con activo y licencia nuevos. Se reconsidera si aparece un requisito sobre el
  oído medio.
- **(C) Quitar las siete entradas:** rechazada — hace cuadrar la aritmética
  destruyendo el dato que el producto existe para enseñar.
- **(D) No hacer nada:** rechazada — es el estado actual, y es una decisión
  tomada por omisión que bloquea el lanzamiento en silencio.
