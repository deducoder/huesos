# Story e7.8: Modo test — Progress

## T1 · Elección de variante al mínimo táctil

- **RED:** los dos botones fallaban con 42 px de alto.
- **GREEN:** `min-h-tactil rounded-suave border-2`, mismo patrón del resto
  del rediseño.
- **Gates:** `./scripts/check` verde.

## T2 · El campo y sus dos botones al mínimo táctil

- **RED:** campo y «Responder» fallaban con 38 px; «Siguiente pregunta» con
  34.
- **GREEN:** las tres clases del design. El campo y «Responder» **no se
  desbordaron** al crecer a 44 px de alto — el ancho no cambia con la
  altura, tal como el scope había anotado, y esta tarea lo verificó en vez
  de darlo por sentado.
- **Gates:** `./scripts/check` verde · suite de navegador entera verde
  (16/16). Verificado con captura.

Nada que el plan no anticipara.
