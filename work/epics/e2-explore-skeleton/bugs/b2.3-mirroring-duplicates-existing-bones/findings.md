# Bug b2.3 — Findings

Hallazgos que no son la causa raíz y que no se resuelven aquí.

## La suite de integración puede dar su veredicto sobre un build viejo

`playwright.config.ts` declara `reuseExistingServer: !process.env.CI`. Si un
`vite preview` quedó vivo de una corrida anterior, Playwright lo reutiliza y
**no reconstruye**: la suite mide el bundle que ese servidor sirva, no el código
del árbol de trabajo.

Ocurrió en esta sesión. Al terminar T3, `./scripts/check-integration` seguía
rojo con **exactamente los mismos números** que antes del arreglo (126/122). La
causa no era el arreglo: un `vite preview` de las 10:15 seguía escuchando en el
4173 y servía un bundle de las 11:01, anterior al cambio. Con los procesos
huérfanos muertos y `dist/` borrado, la misma suite midió 141/61 — el arreglo sí
estaba actuando desde el principio.

**Por qué importa:** es un gate que puede mentir en las dos direcciones. Aquí
dio un rojo falso, que solo cuesta tiempo; el caso peligroso es el verde falso,
donde un arreglo que no funciona pasa el gate porque se midió el build anterior.
El proyecto ya tiene tres precedentes de gates que afirmaban lo que no
comprobaban (b2.1, b2.2, s1).

**Qué haría falta:** que la suite construya siempre, o que el servidor reusado
se compare contra el árbol antes de aceptarlo. Lo primero cuesta ~20 s por
corrida; lo segundo no es trivial.

**Destino:** aparcado — no es la causa de b2.3 y arreglarlo aquí es trabajo
fuera de alcance. Se lleva al parking lot en el cierre.

## Procesos `vite preview` huérfanos acumulados

Al investigar lo anterior aparecieron servidores vivos en los puertos 4173,
4174 y 4175, de las 10:15, 10:22 y 10:35 — anteriores a esta sesión. Los deja
`./scripts/check-integration` cuando la corrida se interrumpe. Se mataron todos
para poder medir; no es destructivo (son servidores de prueba, no datos).

**Destino:** aparcado junto al anterior, del que es síntoma.

## Ni b2.1 ni b2.2 tienen `triage.md`

El paso de clasificación se saltó en los dos bugs anteriores del proyecto y
nadie lo notó hasta ahora. No se corrige retroactivamente: clasificar hoy dos
bugs cerrados hace meses produciría dos etiquetas inventadas, que es peor que
la ausencia.

**Destino:** material para la retrospectiva de este bug.

## El `session-start` de este repositorio afirma algo falso sobre la caché

Su sección «Executing cache vs repo» dice que en este repositorio no aplica
porque las skills se ejecutan desde `.claude/skills/`. No es cierto: las skills
de este ciclo se cargaron desde
`~/.claude/plugins/cache/gemba/gemba/7fa676679abc/`. La afirmación hizo saltar
una comprobación que sí correspondía hacer.

**Destino:** aparcado — es un defecto de la skill, no del producto.
