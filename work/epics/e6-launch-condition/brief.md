# Epic e6: Condición de lanzamiento — Brief

## Hypothesis

Para quien decide cuándo se publica huesos-mono, que hoy tiene una condición de
lanzamiento **imposible de cumplir por construcción**,
la re-formulación explícita de `RF-08` es una **decisión de gobernanza**
que convierte la condición en algo verdadero y comprobable por una prueba.
A diferencia de dejar `RF-08` como está —que exige geometría para siete huesos
que el proyecto decidió no cubrir el 2026-08-16, y por tanto bloquea el
lanzamiento para siempre en silencio—, dice lo que el proyecto realmente
decidió y deja que el gate lo afirme.

## Success metrics

- **Leading:** la prueba de integridad del catálogo afirma el criterio real —206
  entradas, cada una con geometría **o** con una razón documentada de por qué no
  la tiene— y está en verde. Medible en cuanto exista la historia que la toque.
- **Lagging:** con la épica completa, el observable escrito en `RF-08` coincide
  con lo que `./scripts/check` verifica de verdad. Comprobable leyendo el PRD y
  la prueba una al lado de la otra: hoy no coinciden.

## Appetite

S — 2-4 historias.

## Scope boundaries

### No-gos

- **Conseguir o construir geometría para los siete huesos ausentes** (osículos
  del oído medio, hioides). Decidido en el momento de la apuesta, entre tres
  opciones sobre la mesa; el diseño no puede reabrirlo. Traería activo nuevo,
  licencia nueva y vistas propias — es otra épica, no ésta.
- **Quitar las siete entradas del catálogo** para que las cuentas cierren de
  otra manera. Los 206 huesos del esqueleto adulto existen aunque el modelo no
  los dibuje; el catálogo es de anatomía, no del activo 3D.
- **Editar ADR-001 para cambiarle la opinión.** Su punto 4 asumió el riesgo y
  dijo "no se cubren en e1"; lo que corresponde es un ADR nuevo que decida qué
  significa "catálogo completo", no reescribir el viejo.

### Rabbit holes

- **Auditar todo el PRD y todos los guardrails** buscando el mismo problema. La
  review de E5 ya encontró uno parecido (`should-perf-007` declara una medición
  de la que no hay rastro) y está aparcado. Aquí se arregla `RF-08`; el barrido
  general es trabajo propio y sin pedir.
- **Auditar la calidad del contenido del catálogo** —términos latinos,
  sinónimos contra uso real de estudiantes—. Es deuda real y reconocida desde la
  primera sesión, pero es otra épica: se descartó explícitamente al elegir esta.
- **Construir una vista del oído medio "ya que estamos".** Es el premio de
  consolación que reintroduce el no-go por la puerta de atrás.
- **Zanjar cuántos huesos tiene el esqueleto adulto** contra la literatura. El
  proyecto ya fijó su desglose canónico en `catalog.coverage.test.ts` y las
  fuentes discrepan; reabrirlo no sirve a esta apuesta.
