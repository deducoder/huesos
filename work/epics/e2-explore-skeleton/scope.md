# Epic e2: Explore skeleton — Scope

## Objective

Que un estudiante pueda recorrer el esqueleto, elegir un hueso y ver cómo se
llama en español y en Terminologia Anatomica — con el ratón sobre la escena o
con el teclado sobre la lista, indistintamente.

**Value:** es la primera vez que el proyecto se puede usar para estudiar.
Convierte el catálogo de E1 en una herramienta, y deja montado el estado de
selección sobre el que E3 (ficha) y E4 (modo test) se construyen.

## Stories

| ID | Story | Size | Description |
|----|-------|:----:|-------------|
| e2.1 | Agrupación por región | S | Dominio puro: agrupar el catálogo por región y ordenarlo para presentarlo |
| e2.2 | Navegador accesible | M | Lista de huesos por región, navegable con teclado y con nombre accesible |
| e2.3 | Panel de identidad | S | El hueso seleccionado, con ambas nomenclaturas, su región y su lado |
| e2.4 | Escena del esqueleto | M | Canvas react-three-fiber que carga el modelo con Draco y lo muestra |
| e2.5 | Selección en la escena | M | Clic sobre un hueso lo selecciona; el seleccionado se resalta; espejado del hemicuerpo |
| e2.6 | Vista de exploración | S | Composición: escena, navegador y panel sobre un solo estado |

Dependencias: e2.1 → e2.2 → e2.3 → e2.6; e2.4 → e2.5 → e2.6. Sin ciclos.

## In scope

- **MUST:** selección de un hueso por teclado y por ratón; nombre en ambas
  nomenclaturas al seleccionar; los 199 huesos anclados alcanzables; el hueso
  activo comunicado por más de un canal, nunca solo por color.
- **SHOULD:** que la escena permita girar y acercar; que la lista indique qué
  huesos son ausencias declaradas en vez de esconderlos.

## Out of scope

- **Preguntar y validar** — es E4. **Not now.**
- **La ficha individual del hueso aislado** — es E3 (`RF-03`). Aquí se identifica
  dentro del esqueleto, no se aísla. **Not now.**
- **Guardar la selección entre sesiones** — es E5. **Not now.**
- **Los 7 huesos sin geometría** — se listan y se explican, pero no se muestran:
  no tienen malla. **Not now.**
- **Buscar un hueso por nombre** — útil, pero no hace falta para explorar; vuelve
  cuando el catálogo se sienta grande de recorrer. **Not now.**

## Done when

- Seleccionar un hueso —por teclado o por ratón— muestra su nombre en español y
  en Terminologia Anatomica.
- La aplicación es usable **solo con teclado**, verificado en test.
- La escena carga el modelo y resalta el hueso seleccionado.
- Ninguna información depende únicamente del color.
- Todas las historias cerradas · documentación actualizada · retrospectiva hecha.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| El canvas WebGL no se puede probar en jsdom, y la cobertura cae en silencio | H | M | ADR-002 pone la lógica en dominio y la vía accesible en DOM real; lo que queda dentro del canvas se verifica en pruebas manuales explícitas por historia |
| Draco no decodifica en el navegador y la escena queda en negro | M | H | e2.4 va temprano entre las de riesgo y su prueba manual es «se ve el esqueleto»; si falla, la aplicación ya es usable sin escena gracias a e2.2 y e2.3 |
| Escena y lista se desincronizan | M | M | Un único estado en dominio puro; ambas vistas lo proyectan, ninguna guarda el suyo |
| El espejado del hemicuerpo izquierdo confunde la identidad de los huesos | M | M | El catálogo ya distingue `femur-left` de `femur-right` con el mismo `meshName`; el espejo es transformación visual, nunca cambia de entrada |
