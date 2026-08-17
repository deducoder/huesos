# Parking lot

Hallazgos nombrados que no se resolvieron donde aparecieron. Append-only.

## 2026-08-16 · El bundle conserva la URL del CDN de Draco (e2.4)

`three` trae `https://www.gstatic.com/draco/...` como ruta por defecto del
decodificador, y esa cadena queda dentro del bundle aunque la escena configure
`/draco/` y sirva el decodificador desde el propio origen (verificado: HTTP 200
en `/draco/draco_decoder.wasm`, 192 420 bytes).

**Por qué importa:** `must-privacy-006` exige que no haya ninguna petición de red
en tiempo de ejecución. Hoy no la hay, pero la ruta por defecto sigue en el
código: un descuido futuro —quitar el segundo argumento de `useGLTF`— la
activaría en silencio, y el test actual no lo vería porque inspecciona el fuente
de la escena, no el bundle.

**Qué haría falta:** una prueba que intercepte la red con la aplicación
realmente ejecutándose. Eso es una suite de integración con navegador, que el
proyecto no tiene y que sería `./scripts/check-integration`.

**Destino:** aparcado. No bloquea e2 y no hay incumplimiento hoy.

## 2026-08-16 · El recorrido de tabulación es largo (e2.2)

206 botones en un solo orden de tabulación. Un lector de pantalla salta por
encabezados de región, pero quien navegue solo con `Tab` tarda en llegar al
miembro inferior. Se notará en cuanto alguien lo use en serio.

**Destino:** aparcado; candidato a historia propia si aparece una vista de
búsqueda o un salto por regiones.

## 2026-08-16 · Sin verificación con lector de pantalla real (e2.2, e2.3)

Las pruebas usan roles y nombres accesibles, y `userEvent` emite eventos de
teclado auténticos, pero **nadie ha oído la aplicación**. Entre «tiene los
atributos correctos» y «se entiende al oírla» hay una distancia que el epic no
cubre.

**Destino:** aparcado, pendiente de una sesión de prueba manual con lector.

## 2026-08-16 · La lista no se desplaza al hueso elegido en la escena (e2.6)

Con 206 entradas, seleccionar un hueso en la escena lo marca en la lista pero no
la desplaza: el hueso marcado puede quedar fuera de la vista. Pulido de UX real,
no requisito del epic.

**Destino:** aparcado.

## 2026-08-16 · La documentación de e2 describe el contrato anterior a b2.1

`work/epics/e2-explore-skeleton/docs.md` documenta que la escena recibe
`selectedMesh`. Tras b2.1 recibe `selected` (el `id`), porque una malla son dos
huesos y solo la escena conoce la mitad pulsada. Afecta al ejemplo trazado, al
diagrama de flujo y a la invariante I2.

**Destino:** aparcado. `docs.md` es artefacto de `epic-close` y un cierre de bug
no lo edita.

## 2026-08-16 · No hay forma de probar el modelo tal como lo carga la aplicación

b2.1 existió porque las pruebas comparaban el catálogo contra el **archivo**, y
entre el archivo y la escena hay un cargador que transforma los nombres. La
prueba que lo habría atrapado exige ejecutar `GLTFLoader` con Draco en un
navegador: una suite `./scripts/check-integration` que el proyecto no tiene.

**Destino:** aparcado — es la carencia estructural más seria que el proyecto
tiene hoy.
