# Research: Activo del esqueleto — SVG segmentado frente a modelo 3D

**Date:** 2026-08-16 · **Depth:** standard

## Revisión 2 — activo 3D de CASK Anatomy / AnatomyTOOL

> Añadida el mismo día, tras revisar un activo que la primera pasada no
> encontró. **La recomendación cambia.** Se conserva abajo el razonamiento
> original: era correcto sobre la evidencia que tenía, y equivocado sobre la
> evidencia completa.

`https://caskanatomy.info/open3dviewer/?model=overview-skeleton` sirve un
**glTF binario de 3,4 MB** que se descargó y se abrió. Lo que contiene:

- **144 mallas con nombre, hueso por hueso**: `Atlas (C1)`, `Axis (C2)`, cada
  vértebra por su nivel, las 12 costillas, cada carpiano (escafoides, semilunar,
  piramidal, pisiforme, trapecio, trapezoide, grande, ganchoso), cada falange,
  y los craneales profundos que el SVG no puede mostrar — etmoides, esfenoides,
  vómer, lagrimal, palatino, cornete inferior.
- Descontando lo que no son huesos — 14 dientes, 10 cartílagos costales, 2
  agrupaciones de sesamoideos — quedan **118 estructuras óseas**: 82 del lado
  derecho, a espejar, más 36 impares o ya explícitas por lado.
- **Cobertura estimada 200 de 206.** La brecha es exactamente hioides y los seis
  huesecillos del oído medio, verificados ausentes por búsqueda directa en los
  nombres. Es el mismo agujero que la primera pasada identificó por razonamiento
  anatómico, ahora confirmado por medición sobre un activo independiente. *El
  conteo clasifica por nombre y tiene ±1 de holgura; la cifra exacta pide
  revisión manual.*
- Geometría comprimida con `KHR_draco_mesh_compression`, generada desde Blender.

### Lo que cuesta

| Coste | Detalle |
|---|---|
| **Licencia del modelo** | CC BY-SA 4.0. Espejar, renombrar y podar **sí** produce obra adaptada, así que el activo derivado debe publicarse CC BY-SA 4.0 con atribución. La conversión de formato sola no la produce: el texto legal dice que las modificaciones técnicas del art. 2(a)(4) «never produce Adapted Material» |
| **Texturas NC** | 132 mapas de normales embebidos bajo **CC BY-NC-SA** («Thoracic walls», Krebs et al.). **Salida limpia:** son solo `normalTexture`; ningún material usa `baseColorTexture`, el color es un factor plano. Quitarlos cuesta relieve de superficie y sale del NC — decisión a tomar a conciencia, no por descuido |
| **Accesibilidad** | Choque real con **must-a11y-005**: un canvas WebGL no expone rol ni nombre accesible por hueso. Exigiría una lista accesible paralela sincronizada con la escena. En SVG el guardrail sale casi gratis |
| **Peso y tubería** | 3,4 MB ya comprimidos, más el decodificador Draco en cliente, frente a 304 KB del SVG con gzip. Rompe **should-perf-007** tal como está escrito |
| **Sin metadatos** | El archivo no lleva copyright ni atribución dentro; la atribución la tenemos que llevar nosotros |

El visor de CASK es GPL 3.0, pero **no nos afecta**: usaríamos react-three-fiber
sobre el modelo, no su código.

### Recomendación revisada

**Adoptar el modelo 3D de AnatomyTOOL como activo del catálogo — Confidence:
MEDIUM-HIGH.** El argumento decisivo no es que el 3D sea mejor producto, es que
`RF-08` es condición de lanzamiento: con el SVG, llegar a 206 significa etiquetar
a mano los huesos que hoy viven en subgrupos anónimos; con este modelo, 200 ya
vienen nombrados. Convierte el cuello de botella del proyecto en una tarea de
conversión.

Queda abierta una **vía híbrida que merece evaluarse antes de cerrar el ADR**:
usar el modelo 3D como *fuente de verdad del catálogo* — nombres y cobertura — y
renderizar en SVG, proyectando siluetas por hueso desde Blender. Daría la
cobertura del 3D con el peso y la accesibilidad del 2D. No está verificada: es
exactamente lo que un spike debe medir.

**Lo que este informe ya no sostiene:** que el activo 2D de dominio público sea
la mejor base. Sigue siendo la mejor base *2D*, y su ventaja en peso y
accesibilidad es real, pero sus 43 regiones no pueden cumplir RF-08 sin un
trabajo manual que este modelo hace innecesario.

### Fuentes de esta revisión

| Source | Type | Level | Key finding | Date |
|--------|------|-------|-------------|------|
| [Visor open3d de CASK Anatomy](https://caskanatomy.info/open3dviewer/?model=overview-skeleton&export=on) | primary | Very High | Visor Babylon.js GPL 3.0 (Daniel Jansma, LUMC); carga `3dmodels/{model}/{model}.glb` | 2026-08-16 |
| Inspección directa del `.glb` descargado | primary | Very High | 144 mallas nombradas, 118 óseas, ~200/206; Draco; 132 normal maps; sin metadatos de licencia | 2026-08-16 |
| [AnatomyTOOL — Open3DModel create](https://anatomytool.org/open3dmodel-create) | primary | Very High | Fuentes en .blend/.obj/.glb; modelos CC BY-SA 4.0; **texturas CC BY-NC-SA** (Krebs et al.) | 2026-08-16 |
| [AnatomyTOOL — Open3DModel](https://anatomytool.org/open3dmodel) | primary | High | «The model is based on predecessor models BodyParts and Z-Anatomy» | 2026-08-16 |
| [Texto legal CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/legalcode.en) | primary | Very High | Definición de Adapted Material; las modificaciones técnicas del 2(a)(4) «never produce Adapted Material» | 2026-08-16 |

---

## Question

- **Primary:** ¿Existe un activo del esqueleto humano, con licencia que permita usarlo en este producto, en el que cada hueso sea una región o malla identificable por separado — SVG o 3D — y consumible desde React?
- **Secondary:** ¿Qué librerías React libres cubren esto? ¿Qué cobertura de huesos alcanza cada activo frente a los 206 de RF-08? ¿Qué obliga cada licencia? ¿Cuál es el coste real de adaptar frente a dibujar?
- **Unblocks:** E1 (activo anatómico) y la elección 2D/3D, que merece ADR-001.

## Recommendation (primera pasada — revisada arriba)

Adoptar **`Human skeleton front en.svg` de Wikimedia Commons (LadyofHats, dominio
público)** como base 2D, y construir sobre él el mapeo hueso→región. Descartar el
3D para la v1 y no incorporar ninguna librería React de anatomía —
**Confidence: HIGH** para la parte del activo (verificado sobre el archivo
descargado, no sobre su ficha); **MEDIUM** para el coste de completarlo hasta 206.

- **Trade-offs:** se pierde la rotación y la vista posterior que daría el 3D; el
  esqueleto es una ilustración esquemática, no un modelo fotorrealista; hay una
  sola vista (frontal), así que todo hueso no visible de frente necesita una vista
  suplementaria propia.
- **Risks:**
  - *La brecha de 43 a 206 es el proyecto entero.* Mitigación: el catálogo y el
    SVG se completan por regiones, con la prueba de integridad de must-data-002
    verificando cobertura parcial mientras tanto.
  - *Seis huesos no son representables en ninguna vista externa* (los huesecillos
    del oído medio). Mitigación: RF-08 necesita corrección — ver «Gaps».
  - *El peso del SVG* (862 KB en crudo) roza should-perf-007. Mitigación: la capa
    `Labels` (89 elementos) se poda, y comprimido baja a 304 KB con gzip, dentro
    del presupuesto.
- **Alternatives considered:**
  - **BodyParts3D / Z-Anatomy (3D).** Rechazados para v1: CC BY-SA obliga a
    ShareAlike sobre la obra derivada, exigen una tubería de conversión a glTF y
    react-three-fiber, y multiplican el peso descargado. Su ventaja real —
    identificadores FMA por hueso — se puede aprovechar *sin* usar sus mallas.
  - **Anatomogram (`@ebi-gene-expression-group/anatomogram`).** Rechazado: es
    React y SVG con licencia Apache 2.0, pero cubre tejidos y órganos por especie,
    no huesos. No resuelve el problema.
  - **Dibujar el esqueleto desde cero.** Rechazado: semanas de ilustración
    anatómica para llegar donde el activo de dominio público ya está.

## Findings

La creencia de partida — «en React hay un par de librerías libres» — **no se
sostiene**. El término «skeleton» en el ecosistema React está ocupado casi por
completo por *loading skeletons* (`react-loading-skeleton`, `react-skeletons`,
`react-native-skeleton-content`): placeholders de carga, sin relación con
anatomía. La única librería React de anatomía real que apareció, Anatomogram del
EBI, mapea tejidos y órganos para datos de expresión génica, no huesos. No hay
componente React de esqueleto listo para usar; lo que sí hay es el **activo
gráfico**, y eso resuelve la parte cara.

Lo decisivo salió de abrir el archivo, no de leer su ficha. El SVG de LadyofHats
trae **ids semánticos ya puestos** — `FemurLeft`, `ClavicleRight`, `Cranium`,
`ThoracicVertebrae`, `Sacrum`, `PatellaLeft` — sobre una capa `Skeleton` de 909
formas, con las etiquetas de texto aisladas en una capa `Labels` aparte que se
puede eliminar de un tajo para el modo test de RF-04.

Pero esos ids son **43 regiones anatómicas, no 206 huesos**. Son agrupaciones:
`CarpalsLeft` cubre los 8 huesos del carpo, `ThoracicVertebrae` las 12 vértebras,
`PhalangesLeft` las 14 falanges. La geometría interna **sí está subdividida** en
subgrupos anónimos (`CarpalsLeft` contiene 12 subgrupos con 26 formas), pero el
mapeo subgrupo→hueso no existe y no es 1:1: cada hueso se dibuja con varias
formas (contorno, relleno, sombreado). Las costillas ni siquiera tienen id — solo
existe la etiqueta de texto `l_Ribs`.

Ese es el tamaño real de E1: **no es dibujar 206 huesos ni es un trabajo ya
hecho — es etiquetar geometría existente**, agrupando formas y nombrando
subgrupos hasta cubrir el catálogo. Es tedioso y mecánico, no artístico.

### Claims

| Claim | Confidence | Independent sources | Contrary evidence |
|-------|:----------:|:-------------------:|-------------------|
| Existe un SVG de esqueleto humano en dominio público con ids semánticos por región ósea | HIGH | 3 (API de Commons, ficha del archivo, inspección directa del XML descargado) | Ninguna |
| Ese SVG cubre ~43 regiones, no 206 huesos individuales | HIGH | 1 fuente, pero **medición directa y reproducible** sobre el archivo, no opinión | Ninguna; el conteo se puede repetir con el script del anexo |
| No existe librería React libre de esqueleto anatómico interactivo | MEDIUM | 3 búsquedas convergentes (npm, GitHub topics, agregadores) | Ausencia de prueba no es prueba de ausencia: se buscó en inglés y por los términos obvios |
| BodyParts3D ofrece mallas 3D por hueso identificadas con ids FMA, bajo CC BY-SA 2.1 JP | HIGH | 3 (repositorio clon, AnatomyTOOL, artículo de la base de datos) | Ninguna sobre la licencia; la cobertura ósea exacta no está declarada |
| Z-Anatomy deriva de BodyParts3D y publica bajo CC BY-SA 4.0 | HIGH | 4 (SimTK, Blender Conference, CG Channel, GitHub del proyecto) | Ninguna |
| CC BY-SA obliga a licenciar bajo la misma licencia la aplicación que incorpora el activo | LOW | 2, y ambas débiles (foros, glosario legal) | **Fuerte**: la propia FAQ de CC distingue *adaptación* de *colección*, y no afirma que agregar una obra a un proyecto mayor cree una adaptación. La respuesta honesta es «depende, y requiere criterio legal» |
| El conteo de 206 no es mecánico: depende de cómo se cuenten los huesos fusionados | MEDIUM | 2 (Wikipedia, GetBodySmart), con desacuerdo explícito entre fuentes sobre vértebras (26 frente a 32) | Es en sí mismo la evidencia contraria a tratar «206» como número cerrado |

### Gaps & unknowns

- **Seis huesos que RF-08 no puede cumplir como está escrito.** Martillo, yunque y
  estribo (×2) están dentro del hueso temporal: no son representables en ninguna
  vista externa del esqueleto. Varios huesos craneales profundos (etmoides,
  esfenoides, vómer, cornetes, lagrimal, palatino) tampoco se ven de frente. El
  guardrail must-data-002 exige que *toda* entrada tenga región gráfica en el
  esqueleto, y eso es literalmente imposible para esos huesos con una sola vista.
  RF-08 y must-data-002 necesitan admitir vistas suplementarias (cráneo
  despiezado, oído medio) o excluir explícitamente esos huesos del esqueleto
  completo. **Es una corrección de gobernanza, no una tarea de implementación.**
- **El coste de completar hasta 206 no está medido.** Sé que la geometría existe y
  que el mapeo es mecánico; no sé cuántas horas por región. Eso lo responde un
  spike sobre una región concreta, no más lectura.
- **La cuestión ShareAlike quedó sin resolver con fuente primaria.** La FAQ de
  Creative Commons no se dejó extraer en la parte relevante. Como la
  recomendación es un activo CC0, la duda no bloquea nada — pero volvería a ser
  bloqueante si alguna vez se adopta la ruta 3D.
- **No se evaluó la vista posterior.** Existe una familia de archivos hermanos en
  Commons (versiones por idioma, y una `no-text no-color`), no inspeccionados.

## Supply chain health

**N/A para el activo recomendado** — es un archivo SVG en dominio público que se
copia al repositorio: sin paquete, sin versiones, sin mantenedor del que
depender, sin superficie de suministro. Es precisamente parte de su atractivo.

Sobre los paquetes considerados y descartados:

- **`@ebi-gene-expression-group/anatomogram`** — descartado por cobertura
  (tejidos, no huesos), así que no se evaluó a fondo. Señal parcial: respaldado
  institucionalmente por el EBI, código Apache 2.0, imágenes CC BY 4.0, con CI
  configurado; la actividad reciente no se pudo confirmar.
- **react-three-fiber / three.js** — solo entrarían por la ruta 3D, hoy
  rechazada. Adopción muy amplia y mantenimiento activo; el riesgo no es el
  paquete sino el peso y la tubería de conversión que arrastran.
- **DIY < 50 LOC:** el renderizado del SVG interactivo *es* DIY y cabe de sobra
  en ese presupuesto: importar el SVG como componente y delegar eventos por `id`.
  No hace falta ninguna dependencia para RF-01 y RF-02.

## Sources

| Source | Type | Level | Key finding | Date |
|--------|------|-------|-------------|------|
| [File:Human skeleton front en.svg](https://commons.wikimedia.org/wiki/File:Human_skeleton_front_en.svg) | primary | Very High | Dominio público, autoría LadyofHats; 862 KB | 2026-08-16 |
| Inspección directa del XML descargado (`front.svg`) | primary | Very High | 43 regiones con id semántico; capa `Labels` separable; costillas sin id; `Sternum` es path único | 2026-08-16 |
| [API de Wikimedia Commons](https://commons.wikimedia.org/w/api.php) | primary | Very High | URLs reales y licencia «Public domain» confirmada por metadatos | 2026-08-16 |
| [File:Human skeleton (svg template).svg](https://commons.wikimedia.org/wiki/File:Human_skeleton_(svg_template).svg) | primary | Very High | CC0 1.0, Mikael Häggström; misma familia estructural, 1.4 MB | 2026-08-16 |
| [BodyParts3D (clon de Moerman)](https://github.com/Kevin-Mattheus-Moerman/BodyParts3D) | primary | High | Mallas por parte con ids FMA; contenido CC BY-SA 2.1 JP, código MIT | 2026-08-16 |
| [Z-Anatomy en SimTK](https://simtk.org/projects/z-anatomy) | primary | High | Atlas 3D abierto derivado de BodyParts3D, CC BY-SA 4.0, +5000 estructuras | 2026-08-16 |
| [Anatomogram (EBI)](https://github.com/ebi-gene-expression-group/anatomogram) | primary | High | React + SVG interactivo, Apache 2.0, pero cubre tejidos y órganos, no huesos | 2026-08-16 |
| [Blender Conference 2022 — Z-Anatomy](https://conference.blender.org/2022/presentations/1365/) | secondary | High | Confirma origen, licencia y alcance del proyecto | 2026-08-16 |
| [AnatomyTOOL — Open 3D Model](https://anatomytool.org/open3dmodel) | secondary | High | Geometría de huesos individuales tomada de BodyParts3D; visor GPL3 | 2026-08-16 |
| [List of bones of the human skeleton](https://en.wikipedia.org/wiki/List_of_bones_of_the_human_skeleton) | tertiary | Medium | 206 = 80 axial + 126 apendicular; advierte que el conteo varía según los fusionados | 2026-08-16 |
| [GetBodySmart — Skeletal System](https://www.getbodysmart.com/skeleton-organization/skeletal-system-overview/) | secondary | Medium | Desglose axial; discrepa en el conteo de vértebras (32 frente a 26) | 2026-08-16 |
| [FAQ de Creative Commons](https://creativecommons.org/faq/) | primary | High | Distingue adaptación de colección; no zanja el caso de software que incorpora el activo | 2026-08-16 |
| [CC Channel / CGPress sobre Z-Anatomy](https://www.cgchannel.com/2022/05/check-out-amazing-free-3d-anatomy-reference-z-anatomy/) | tertiary | Medium | Confirmación independiente de licencia y alcance | 2026-08-16 |

**Nota de método:** la técnica prescribe delegar el barrido a la capacidad de
deep-research. No estaba disponible en esta sesión, así que las búsquedas se
hicieron directamente y la evidencia decisiva salió de descargar e inspeccionar
los archivos. Se declara para que nadie lea este informe como un fan-out
adversarial que no ocurrió.

## Landed in

- **ADR-001** (pendiente): «SVG 2D de dominio público frente a modelo 3D para el
  esqueleto interactivo». Este informe es su material de partida.
- **E1 — Activo anatómico** (backlog): se concreta en adoptar el SVG de
  LadyofHats, podar la capa `Labels`, y definir el esquema del catálogo con id
  estable por hueso más su id FMA cuando exista.
- **Corrección de gobernanza pendiente** sobre RF-08 y must-data-002: los
  huesecillos del oído y los craneales profundos no admiten región en el
  esqueleto completo. Sin esta corrección, el guardrail nace incumplible.
