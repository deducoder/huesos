---
name: always-mount-for-animation-needs-full-e2e-rerun
description: "cambiar un subárbol de montaje condicional a siempre-montado (para poder animar apertura/cierre con CSS) puede colisionar con nombres accesibles que antes eran únicos por construcción — solo la suite E2E completa lo atrapa, no un checklist manual acotado a lo nuevo"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 73cbd697-dd27-4745-b344-bbc95c5df898
  modified: 2026-08-19T00:16:31.802Z
---

Convertir `{condicion && <div>...}` en un contenedor siempre montado (con
`inert`/altura cero para poder animar la transición en vez de saltar) puede
romper un locator de test que dependía, sin saberlo, de que el contenido
colapsado **no existiera en el DOM**. El caso concreto (s2, huesos-mono):
"Hioides" es una categoría de un solo hueso — al quedar su contenido siempre
montado, el botón de categoría y el botón del hueso propio pasaron a
compartir el mismo nombre accesible, y `getByRole('button', {name:
/^hioides/i})` en un test Playwright escrito mucho antes dejó de ser
unívoco. La categoría en cuestión no era la que se estaba tocando a
propósito — apareció en un archivo E2E que la historia ni mencionaba.

**Por qué:** un checklist de integración manual acotado a "lo que esta
historia agregó" (los 6 componentes tocados) no habría encontrado esto — el
locator roto vivía en una prueba de un caso completamente distinto (huesos
sin geometría) que nunca se pensó relacionado con animaciones. Solo correr
la suite E2E **completa** (`./scripts/check-integration`) lo sacó a la luz.
Emparienta con [[keeping-old-content-mounted-can-duplicate-text]] —mismo
mecanismo raíz, contenido que deja de ser mutuamente excluyente— pero acá el
disparador es el propio cambio de montaje, no dos vistas que empiezan a
convivir.

**How to apply:** cuando un plan de historia incluye "hacer que X deje de
desmontarse condicionalmente" (el patrón típico para animar apertura/cierre
con CSS puro), el paso de integración manual tiene que correr la suite E2E
completa existente, no solo un recorrido de las interacciones nuevas — el
riesgo no está en lo que se tocó a propósito, sino en cualquier test viejo
que asumía la ausencia del DOM como parte de su contrato implícito.
