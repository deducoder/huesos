# Epic e5: Progreso y repaso dirigido — Scope

## Objective

Que el error del estudiante dirija su estudio: la aplicación recuerda, por
hueso, en qué acertó y en qué falló, conserva ese registro entre sesiones en su
propio navegador, y usa ese registro para decidir qué preguntar a continuación.

**Value:** cierra el outcome "el fallo dirige el estudio" y completa `RF-09`, el
último requisito funcional del backlog antes del catálogo completo (E6). El
modo test deja de repartir preguntas al azar y empieza a insistir donde el
estudiante flojea, sin cuenta de usuario y sin que un dato salga del navegador.

## Stories

| ID | Story | Size | Description |
|----|-------|:----:|-------------|
| e5.1 | Progress record | S | Dato puro en dominio: aciertos y fallos por hueso, y la función que registra un veredicto |
| e5.2 | Browser persistence | M | Adaptador de `localStorage` tras una interfaz mínima, con degradación explícita a memoria (ADR-004) |
| e5.3 | Test engine records its verdict | M | `TestQuestion` registra cada respuesta; el registro sobrevive al desmontaje de la vista y a la recarga |
| e5.4 | Failed-first selection | M | `pickTestableBone` recibe el registro y sortea con pesos derivados de él, con el sorteo inyectado (ADR-005) |
| e5.5 | Privacy guardrail, actually gated | S | La comprobación que `must-privacy-006` declara y que no existe: el gate falla ante cualquier `fetch`/`XMLHttpRequest` en tiempo de ejecución |

Dependencias: `e5.1` no depende de nada · `e5.2` y `e5.4` dependen de `e5.1` ·
`e5.3` depende de `e5.1` y `e5.2` · `e5.5` es independiente. Sin ciclos.

## In scope

- **MUST:**
  - El registro por hueso de aciertos y fallos, como dato puro y probable sin
    navegador.
  - Su persistencia entre sesiones en el mismo navegador, con el observable
    literal de `RF-09`: responder, recargar, y que el registro siga ahí.
  - El registro alimentado por **ambas** variantes de test (`RF-04` esqueleto
    completo y `RF-05` hueso aislado), que ya comparten `TestQuestion`.
  - La selección de la siguiente pregunta ponderada por ese registro.
  - La comprobación automática de `must-privacy-006`, porque esta es la épica
    que introduce persistencia y es donde "el progreso no sale del navegador"
    deja de ser una promesa y pasa a ser un gate.
- **SHOULD:**
  - Degradación silenciosa pero no engañosa cuando el almacenamiento no está
    disponible: la sesión funciona, el progreso no sobrevive a la recarga, y
    nada finge haberse guardado.

## Out of scope

- **Mostrar el progreso al estudiante** (panel, estadísticas, marcas en la
  lista de huesos) — `RF-09` pide recordar y priorizar, no exhibir. **Not now**:
  una épica propia si alguna vez se quiere; el dato ya estaría.
- **Borrar o reiniciar el progreso** — nadie lo ha pedido y no bloquea el
  objetivo. **Not now**: al parking lot; es una historia corta el día que haga
  falta.
- **Progreso por variante de test** (distinguir haber fallado un hueso en el
  esqueleto completo de haberlo fallado aislado) — es una distinción plausible
  y sin ningún requisito que la respalde. **Not now**: el registro por hueso no
  la impide, solo no la hace.
- **Componente temporal** (cuándo se acertó, decaimiento con el tiempo) —
  arrastra reloj, husos horarios y toda la superficie de la repetición
  espaciada, que el brief excluye. **Not now**: se reconsidera si aparece un
  requisito sobre *cuándo* repasar.

## Done when

- Tras responder una pregunta y recargar la página, el registro de ese hueso
  conserva el resultado anterior — verificado en navegador real, no solo en
  prueba unitaria.
- Con un registro donde un hueso acumula fallos y otro solo aciertos, la
  selección elige el fallado con mayor frecuencia que el acertado — afirmado
  con una prueba determinista sobre dominio puro, con el sorteo inyectado.
- Ambas variantes de test alimentan el mismo registro.
- `./scripts/check` falla si alguien introduce una petición de red en tiempo de
  ejecución.
- All stories complete · docs updated · retrospective done

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| El registro no puede vivir en `TestQuestion` (se pierde al desmontar la vista) y la plomería para subirlo resulta ser el trabajo real de e5.3 | M | M | Decidir la propiedad del estado en el diseño de e5.3, no durante la implementación; el aprendizaje `state-ownership-follows-survival-not-cleanliness` ya nombra este patrón exacto |
| Los pesos de la ponderación se eligen a ojo y "se sienten mal" con uso real | M | L | ADR-005 los declara como juicio explícito, no como medición; la prueba fija el *orden*, no los números, así que ajustarlos no rompe la suite |
| La comprobación de `must-privacy-006` resulta difícil de escribir sin falsos positivos (el bundle contiene `fetch` en código de terceros que nunca se ejecuta) | M | M | Comprobar en tiempo de ejecución sobre la aplicación montada, no por grep sobre el bundle; la suite de navegador de s1 ya observa el tráfico real y sirve de segunda red |
| `localStorage` lanza en modo privado y rompe el modo test entero | L | H | ADR-004 fija la degradación a memoria en el adaptador, y e5.2 la prueba con un doble que lanza |
