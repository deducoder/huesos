# Story e1.6: Complete catalog — Progress

| Task | Status | Commit | Nota |
|------|:------:|--------|------|
| T1 · Exigir cobertura canónica | done | `4b2a1f9` | RED con 5 fallos sobre 6 aserciones |
| T2 · Cráneo, cara y tórax | done | `1c9e3a7` | 47 entradas |
| T3 · Cinturas y miembros | done | `1c9e3a7` | 126 entradas |
| T4 · Las siete ausencias | done | `1c9e3a7` | Osículos e hioides con su razón |
| T5 · Prueba de integración manual | done | — | La única malla ósea sin entrada es `Manubrium of sternum`, como declaraba el scope |

## Desvíos respecto del plan

- **T2, T3 y T4 cayeron en un commit, no en tres.** El plan los separaba para
  que cada bloque dejara el gate en un estado conocido; las 180 entradas se
  generaron y verificaron de una vez. Es el desvío más serio de la historia:
  con volumen así, tres commits habrían dado tres puntos de retroceso y hubo uno.
- **Las entradas se generaron con un script y se revisaron**, en vez de
  teclearse una por una. El script vivió en el área temporal y no se versionó:
  no es una herramienta del proyecto, fue andamiaje de un solo uso. Lo que se
  commitea es el dato revisado, y lo que lo respalda son las 38 aserciones del
  gate, no la confianza en el generador.
- **El test destapó ids especulativos.** `isUnpaired` guardaba
  `sternum-manubrium`, `sternum-body` y `sternum-xiphoid`, escritos en e1.2 por
  anticipación. La decisión del esternón como entrada única los dejó sin uso y
  se eliminaron: YAGNI aplicado tarde, pero aplicado.
