# Story e9.1: Selection colour that actually stands out — Scope

## User story

As a quien recorre el esqueleto buscando un hueso concreto,
I want que el hueso seleccionado se encienda de forma inconfundible en la
escena 3D,
so that pueda ver cuál elegí sin acercar la cara a la pantalla ni compararlo
con su vecino.

## Acceptance criteria

```gherkin
Given que estoy en Explorar con el esqueleto a la vista
When selecciono un hueso
Then se distingue del resto a simple vista, no por un tinte apenas visible

Given el mismo color de selección
When lo miro en la píldora del navegador, en el botón del panel de identidad
  y en el resaltado 3D
Then funciona en los tres, no en uno a costa de los otros

Given el nuevo valor del acento
When se mide el contraste del texto que lleva encima
Then sigue cumpliendo el 4.5:1 que WCAG 2.1 exige para texto normal

Given el modo test por opción múltiple
When e9.2 vaya a pintar el acierto y el error
Then encuentra sus tokens ya definidos en `@theme`, no dos colores nuevos
     elegidos aparte

Given los colores por región del mockup (`REGION_ACCENT`)
When cambia el acento
Then no cambian: son otro sistema y esta historia no los toca
```

## Example

Reproducido en el navegador, 390 px, con el fémur derecho seleccionado desde
la vía accesible. **El instrumento se validó primero:** dos capturas seguidas
sin tocar nada dan 0 píxeles de diferencia.

| Medida | Valor |
|--------|------:|
| Color medio del fémur **sin** seleccionar | `rgb(168,161,154)` |
| Color medio del fémur **seleccionado** | `rgb(172,172,196)` |
| Diferencia por canal | **+4 R · +11 G · +42 B** |
| Suma de canales | **57** de 765 posibles |
| Píxeles del hueso que cambian | 1.727, delta medio 68 |

El umbral con el que la suite decide que un píxel «cambió» es **40**. El
resaltado actual da 57: apenas por encima de lo que una máquina considera
detectable, y todo el cambio en un solo canal. A la vista, el hueso pasa de
beige a un lila pálido.

La causa está en cómo se aplica: `--color-acento` es `#2f5fe0`
—`rgb(47,95,224)`, oscuro y saturado en azul— y entra como `emissive` al 0.6
(`SkeletonScene.tsx:77`) sobre un material beige claro. La emisión **suma
luz**: un color con 47 de rojo y 95 de verde no puede aclarar un beige que ya
está en 168 y 161, así que solo empuja el azul. Lo que funciona como fondo
plano de un botón no funciona como emisión.

**Aviso de medición para quien retome esto:** medir el lienzo entero da 90.210
píxeles y un delta medio de 497, y es falso — al seleccionar aparece el panel
de identidad, que flota sobre el lienzo y entra en la captura. La ventana útil
es la parte del lienzo que el panel no cubre.

## In scope

- **Un valor nuevo para `--color-acento`**, elegido viendo a la vez los tres
  sitios que lo consumen: la píldora del navegador, el botón del panel de
  identidad y el resaltado 3D.
- **Sus dos derivados**, `--color-acento-suave` y `--color-acento-fuerte`, que
  tienen que seguir siendo coherentes con el nuevo acento y conservar sus
  ratios de contraste declarados.
- **Los tokens de acierto y error** que hoy no existen y que e9.2 necesita
  para calificar las opciones del test — se eligen en esta misma pasada sobre
  `@theme`, como el plan de la épica pide, para no abrir el archivo dos veces.
- **La forma de aplicar el resaltado 3D**, si medir demuestra que ningún color
  razonable resalta con `emissive` al 0.6 sobre beige. La historia pide que el
  hueso se distinga; el token es el medio, no el fin.

## Out of scope

- **Los 14 literales hexadecimales fuera de `@theme` y el gate que vigila la
  paleta equivocada** — rabbit hole declarado en el brief, aparcado para la
  épica de consolidación visual.
- **`REGION_ACCENT`**, los colores por región del mockup (e8.5). Son otro
  sistema, con otro propósito, y ninguno de los nueve puntos los menciona.
- **Pintar el resultado del test** con los tokens nuevos — esta historia los
  **define**, e9.2 los **usa**.
- **El color del lienzo** (`--color-lienzo`), fijado por el mockup en e8.5 y
  verificado contra el hueso beige en e7.2.
- **Animar la aparición del resaltado** — rabbit hole de la épica.
- **Tocar el material del activo 3D** — no-go del brief: el resaltado es
  `emissive` en tiempo de ejecución, no una edición del glTF.

## Done when

- El hueso seleccionado se distingue a simple vista en el teléfono, y el
  cambio medido supera con holgura los 57 puntos de suma de canales que da
  hoy — con la ventana de medición correcta, no el lienzo entero.
- El mismo color se ve bien en los tres sitios que lo consumen, comprobado en
  una muestra que los enseñe juntos.
- El contraste de todo par que use el acento sigue cumpliendo 4.5:1, con el
  número escrito al lado del token como ya hacen los demás.
- `@theme` tiene tokens de acierto y error, sin que ningún componente los use
  todavía.
- Ningún color nuevo vive fuera de `@theme` (ADR-007).
- `./scripts/check` y `./scripts/check-integration` en verde, incluida la
  prueba de tokens de diseño.
