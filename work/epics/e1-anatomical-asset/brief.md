# Epic e1: Anatomical asset — Brief

## Hypothesis

Para estudiantes de medicina que necesitan asociar el nombre de un hueso a su
forma y su posición, el **catálogo anatómico de huesos-mono** es una base de
datos de huesos anclada a una geometría real, que entrega un identificador
estable por hueso y la geometría que le corresponde. A diferencia de partir de
un diagrama que hay que recortar y etiquetar a mano, parte de un modelo que ya
trae 199 de los 206 huesos nombrados uno por uno.

## Success metrics

- **Leading:** el catálogo carga en el repositorio con al menos una región
  anatómica completa —columna vertebral, 26 huesos— y una prueba automática
  verifica que cada entrada tiene id único, nombre en español, término en
  Terminologia Anatomica y geometría existente.
- **Lagging:** las 199 entradas que el modelo cubre están en el catálogo, con la
  prueba de integridad en verde y los 7 ausentes declarados como excepción
  explícita, de modo que E2 pueda renderizar sin tocar datos.

## Appetite

**M** — 5-7 historias.

## Scope boundaries

### No-gos

- **No se dibuja anatomía a mano.** Ni recortar SVG hueso por hueso ni modelar en
  Blender desde cero: si el activo no lo trae, se declara ausente. Es
  precisamente la trampa que hundiría el proyecto, y la razón por la que este
  epic existe.
- **No se usan las texturas del modelo.** Son CC BY-NC-SA y el resto es
  CC BY-SA 4.0; se eliminan los 132 mapas de normales para no arrastrar la
  cláusula no comercial a todo el producto.
- **No se resuelven los 7 huesos ausentes** —los seis huesecillos del oído y el
  hioides—. Riesgo asumido por decisión explícita del 2026-08-16; cubrirlos
  exige vistas propias, y eso no es este epic.
- **No se construye interfaz de usuario.** Ni exploración, ni ficha, ni test:
  eso es E2 en adelante. Este epic entrega datos y geometría, nada que se mire.
- **No se toca la nomenclatura como producto.** Se cargan los nombres; enseñarlos,
  validarlos o tolerar erratas es del motor de test.

### Rabbit holes

- **Perseguir la exactitud anatómica del modelo.** No somos la autoridad
  anatómica: el modelo viene de BodyParts3D y Z-Anatomy vía AnatomyTOOL, y sus
  autores declaran que no garantizan exactitud. Se adopta como está.
- **Optimizar el peso antes de saber si estorba.** Son 3,4 MB con Draco. Medir
  primero, y solo entonces decidir si hay que trocear por regiones.
- **Diseñar el esquema del catálogo para todo lo que podría venir** —músculos,
  articulaciones, patologías, imágenes—. El esquema cubre huesos, y punto.
- **Resolver hoy si el render final es 3D o SVG proyectado.** El catálogo debe
  servir a ambos; la elección de render es de ADR-001 y de E2, no de aquí.
- **Traducir a mano los 199 nombres del inglés.** Es trabajo mecánico y con
  trampas de terminología; conviene decidir de dónde sale el español antes de
  empezar a teclear.
