# Story e9.3: The isolated bone fits and turns — Progress

## T1 · La aritmética del encuadre conoce el ancho y la reserva

**Hecho.** `frameObject(size, view, margin)` en `src/domain/framing.ts`
devuelve `{ distance, shiftY }`. Se apoya en `distanceToFit` dos veces —una
por altura corregida por la reserva, otra por ancho corregido por el
aspecto— en vez de sustituirla, así que la aritmética vive en un solo sitio
y `SkeletonScene` no se toca.

**RED:** 7 pruebas nuevas con los dos casos medidos sobre las 144 mallas del
modelo: la clavícula (0,140 × 0,033, ratio 4,26) y el fémur (0,116 × 0,451,
ratio 0,26).

**Un test estaba mal y lo corrigió el código, no al revés.** Escribí «en una
pantalla apaisada manda el alto, como antes» y falló. La expectativa era
falsa: con aspecto 1,556 la clavícula sigue gobernada por su ancho, porque
0,140/1,556 = 0,090 es mayor que su alto de 0,033. Que el ancho mande
**incluso en escritorio** es la medida de lo desproporcionado que es este
hueso. Se reemplazó por la propiedad real —en apaisado necesita menos
distancia que en un teléfono— y se añadió el caso que faltaba: comprobar
contra el encuadre de hoy que la clavícula pasa de no entrar a entrar.

**Verificación — mutación forzada, con la condición que el plan exigía:**
replicando el defecto real (`max(w, h)` tratado como altura, sin aspecto),
caen 3 pruebas y **todas son de la clavícula**; las dos del fémur siguen
verdes. Era la condición explícita — si también hubiera matado las del
fémur, las pruebas no distinguirían el defecto de un cambio cualquiera.

**Gate:** `./scripts/check` verde.

**Dato del camino:** el bug es de teléfono, confirmado con números. A la
distancia que el código actual elige, el ancho visible es 0,072 en un
lienzo de aspecto 0,513 (la clavícula mide 0,140: no entra) y 0,218 en uno
de 1,556 (sí entra). El scope acertó al acotarlo a pantalla chica.
