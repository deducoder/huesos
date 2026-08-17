# Bug b2.3: Mirroring duplicates bones the model already brings whole — Triage

## Severity: S1-High

No tumba la aplicación —204 de los 206 huesos se comportan bien y nada falla en
consola—, pero corrompe en silencio justo lo que el producto promete: decir qué
hueso es cuál. Seleccionar "hueso parietal derecho" enciende los dos
hemisferios, así que la aplicación **afirma una anatomía falsa** con la misma
confianza con la que acierta en el resto. Un estudiante no tiene cómo notarlo:
no hay error, solo una respuesta equivocada bien presentada.

Sube de S2 a S1 por dos multiplicadores medidos hoy: el modo test (E4) puede
preguntar por los parietales y muestra ese mismo resaltado como corrección, con
lo que el defecto pasa de mostrar mal a **enseñar mal**; y el z-fighting no se
limita al cráneo — 21 de las 144 mallas del modelo están centradas en X=0 y el
espejado las duplica igual, así que el artefacto visual recorre toda la línea
media (columna, frontal, occipital, esfenoides, manubrio).

No es S0 porque la aplicación es usable, ningún dato se pierde y el fallo está
acotado a huesos identificables.

## Origin: Design

El código hace exactamente lo que su diseño dice que haga: `SkeletonScene`
dibuja el modelo dos veces porque ADR-001 declaró, como consecuencia aceptada
del activo elegido, que «el modelo trae solo el hemicuerpo derecho más las
piezas impares». El defecto entró al escribir esa caracterización, no al
programarla — es una afirmación sobre los datos del activo que nadie midió
contra el archivo, y que el archivo desmiente por partida doble: trae una malla
`Parietal bone left` con lado propio, y sus piezas impares están centradas en el
eje del espejo, donde espejar es duplicar.

No es Code: no hay descuido de implementación que corregir en `SkeletonScene`
mientras la premisa siga en pie. No es Requirements: ningún requisito pidió
espejar; el espejado es medio, no fin. No es Integration ni Environment: se
reproduce en una sola escena, en un solo navegador, sin nada externo.

Clasificado con conocimiento parcial de la causa —el gemba previo a abrir el
bug ya había medido el activo—, así que se declara: esta clasificación **no** es
independiente de lo observado, aunque sí lo es de cualquier análisis formal de
causa raíz, que todavía no se ha hecho.
