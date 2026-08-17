# Bug b2.1: Bone names sanitized by three — Retrospective

## Qué se arregló

`GLTFLoader` no conserva el nombre del nodo: lo pasa por
`PropertyBinding.sanitizeNodeName`. De los 144 nombres del modelo solo
sobrevivían tres —`Sacrum`, `Coccyx`, `Vomer`—, y por eso solo esos huesos
respondían. El catálogo y la escena hablaban de nombres distintos.

Ahora la comparación normaliza ambos lados con la función de la propia librería,
y el resaltado compara **huesos resueltos por mitad** en vez de nombres de malla,
lo que además corrige un segundo defecto que el primero tapaba: un hueso par se
encendía en los dos lados.

## Lo que este bug enseña

- **El usuario encontró en un minuto lo que 80 pruebas no vieron.** No es un
  fallo de las pruebas en sí: es que **ninguna ejecutaba la escena**. La
  retrospectiva de e2 ya había nombrado el patrón —«tres historias seguidas
  cerraron con compila y se sirve en vez de se ve»— y el bug apareció
  exactamente ahí. Nombrar un riesgo no lo mitiga.
- **Anclar por un identificador que atraviesa una transformación es frágil.** El
  test de anclaje de E1 comparaba catálogo contra **archivo**, y era correcto y
  pasaba. Lo que faltaba era comparar catálogo contra **lo que el consumidor
  recibe**. Entre el archivo y la escena hay un cargador, y el cargador
  transforma.
- **El primer defecto tapaba el segundo.** El resaltado de ambos lados no podía
  observarse mientras ningún hueso par fuese seleccionable. Arreglar el primero
  sin analizar habría dejado el segundo suelto y lo habría convertido en otro
  informe del usuario.
- **La ventaja de haber puesto la lista primero se cobró aquí.** Con la escena
  inutilizada para el 98,5 % de los huesos, la aplicación seguía siendo usable.
  El orden del epic no fue una preferencia estética.

## Qué evitaría esta clase de bug

Una prueba que **cargue el modelo como lo carga la aplicación** y compruebe que
los nombres casan. La versión barata ya está puesta —T4 aplica el saneado de
three a los nombres del archivo—, pero la de verdad exige ejecutar `GLTFLoader`
con Draco, y eso es una suite de integración con navegador que el proyecto no
tiene: sería `./scripts/check-integration`.

**La regla general que queda:** cuando un dato viaja del repositorio a una
librería de terceros, la prueba tiene que observar el dato **al otro lado** de la
librería, no antes de entrar.
