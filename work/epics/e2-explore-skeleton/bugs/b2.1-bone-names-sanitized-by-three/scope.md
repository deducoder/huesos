# Bug b2.1: Bone names sanitized by three — Scope

WHAT: En la escena 3D solo se pueden seleccionar tres huesos —sacro, cóccix y vómer— y solo esos se resaltan; los otros 196 no responden al clic ni cambian de aspecto al elegirlos en la lista.
WHEN: Siempre, desde que la escena se montó en e2.4. Al hacer clic sobre cualquier hueso de nombre compuesto o con punto, y al seleccionar cualquiera de ellos desde el navegador.
WHERE: `src/components/SkeletonScene.tsx` — la comparación `malla.name === selectedMesh` y la llamada `boneIdForMesh(bones, evento.object.name, half)`; ambas asumen que el nombre del objeto en la escena es el `meshName` del catálogo.
EXPECTED: Cualquiera de los 199 huesos anclados debe poder seleccionarse con un clic en la escena y resaltarse al elegirlo en la lista.
DONE WHEN: Un test que pase los nombres por el saneado de `three` resuelve los 199 huesos anclados, el resaltado responde para todos ellos, y la aplicación construye con los gates en verde.
