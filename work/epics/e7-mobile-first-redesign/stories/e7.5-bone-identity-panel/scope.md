# Story e7.5: Panel de identidad — Scope

## User story

As a estudiante que acaba de elegir un hueso,
I want ver su nombre con la misma voz visual que el resto de la aplicación y
poder tocar «ver ficha completa» sin apuntar,
so that el panel se sienta parte del mismo rediseño, no una vista que quedó
atrás.

## Acceptance criteria

```gherkin
Given un hueso elegido en 390×844
When se mide el botón «ver ficha completa»
Then mide 44×44 px o más — contra los 34×141 px de hoy

Given el nombre del hueso en el panel de identidad
When se mide su fuente computada
Then usa la familia display empaquetada en e7.3, igual que el título de la
     cabecera

Given un par sin geometría en ningún lado (martillo, yunque, estribo) —el
      navegador ya no ofrece elegir su lado desde e7.4
When se abre su panel de identidad
Then no afirma un lado que el estudiante nunca eligió

Given un par con geometría en al menos un lado
When se abre su panel de identidad
Then el campo «Lado» sigue mostrándose, sin cambios

Given el panel usado desde `ExploreView` y desde `BoneDetailView`
When se navega entre las dos vistas
Then se ve y se comporta igual en las dos — es el mismo componente
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| «fémur derecho» elegido, botón «ver ficha completa» | medir | ≥ 44×44 px (hoy: 34×141) |
| «fémur» en el `h2` del panel | medir su fuente | `font-family` contiene `Fredoka` |
| `malleus-right` (seleccionado desde la fila colapsada del navegador, e7.4) | abrir su panel | sin campo «Lado» |
| `femur-right` | abrir su panel | campo «Lado: derecho», sin cambios |

## In scope

- **El botón «ver ficha completa»** al mínimo táctil de 44×44 px.
- **El título del hueso (`h2`) con la familia display**, `--font-display` de
  e7.3 — es el segundo título más prominente de la aplicación después del de
  la cabecera, y hoy sigue con la pila del sistema.
- **Coherencia de borde y radio con el resto del rediseño**: el aviso de
  ausencia y el botón de «ver ficha completa» siguen con borde de 1 px y radio
  por defecto — e7.1 les cambió el color pero no el grosor ni el radio que el
  shell (e7.1) y el navegador (e7.4) ya aplican (`border-2`, `rounded-suave`).
  No es pulido genérico: es aplicar el mismo contrato de tokens que dos
  historias anteriores ya establecieron, a los dos elementos de este
  componente que quedaron afuera.
- **El campo «Lado» no se muestra para un par totalmente ausente**
  —martillo, yunque, estribo—, coherente con la decisión de e7.4 de que el
  navegador tampoco ofrece elegir su lado. Es el hallazgo que la
  retrospectiva de e7.4 dejó explícito para esta historia.

## Out of scope

- **El aviso de ausencia deja de decir «no se puede señalar en el
  esqueleto»** para un hueso cuyo panel ya no distingue lado — el texto sigue
  siendo correcto (`bone.missingReason` no depende del lado) y no hace falta
  tocarlo.
- **El resto del pulido visual** —espaciado fino, jerarquía tipográfica de
  los `dt`/`dd`— queda para el cierre de la épica, según decidió el usuario en
  e7.4.
- **El anuncio en vivo (`role="status"`)** ya menciona el lado condicionalmente
  (`bone.side !== null ? …`); si el campo visible deja de mostrar «Lado» para
  los pares ausentes, el anuncio en vivo debe seguir la misma regla — no es
  alcance nuevo, es la misma condición aplicada dos veces en el archivo.
- **Cambiar `isUnpaired` o el catálogo** — la pregunta que resuelve esta
  historia es «¿vale la pena distinguir lado en la interfaz?», no «¿es este
  hueso impar?». Son preguntas distintas (aprendizaje de e7.4) y la primera
  vive en la vista, no en el dominio.

## Done when

- En 390×844: el botón «ver ficha completa» mide 44×44 px o más.
- El `h2` del hueso usa `--font-display`.
- Un par totalmente ausente no muestra el campo «Lado» ni lo anuncia en el
  estado vivo; un par con al menos un lado representable sigue mostrándolo sin
  cambios.
- El aviso de ausencia y el botón usan `border-2` y el radio que corresponde
  según el resto del rediseño.
- `BoneIdentity.test.tsx` protege el comportamiento existente que no cambia;
  los casos que sí cambian a propósito (el campo «Lado» para pares ausentes)
  tienen su prueba nueva, declarada explícitamente en el diseño.
- `./scripts/check` en verde.

## Notes

- Gemba del 2026-08-17 al arrancar: medido en navegador, el botón «ver ficha
  completa» mide **34×141 px** y el `h2` del hueso usa la pila del sistema
  (`-apple-system, …`), no Fredoka.
- `BoneIdentity` se usa en dos sitios —`ExploreView.tsx:39` y
  `BoneDetailView.tsx:62`—, cada uno le pasa un `bone` ya resuelto por
  `findBone`. No recibe el catálogo completo; si el diseño necesita mirar el
  otro lado de un par, es una decisión a tomar ahí, no asumida acá.
- El resto de `BoneIdentity` —colores, la estructura de `dl`, el anuncio en
  vivo, los sinónimos— ya pasó por el barrido de tokens de e7.1 y no tiene
  color literal alguno. Esta historia no repite ese trabajo.
- Referencias: retrospectiva de e7.4 («Para el plan de e7.5»),
  `records/parking-lot.md` (pulido diferido al cierre de la épica — no
  confundir con este alcance, que es aplicar contratos ya existentes, no
  pulir a ojo), ADR-007, ADR-008.
