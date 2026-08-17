---
name: commit-discipline-inverts-with-volume
description: La disciplina de un commit por tarea cede justo en las tareas de volumen, que son las que más necesitan puntos de retroceso.
metadata:
  type: feedback
---

Patrón observado a lo largo del epic e1, visible solo al mirar las seis
historias juntas: **cuanto más volumen tenía una tarea, más se agrupó su
commit**. Las historias pequeñas respetaron un commit por tarea; e1.5 fundió
RED y GREEN; e1.6 metió 180 entradas de catálogo en un solo commit cuando su
plan pedía tres bloques.

**Why:** es exactamente al revés de lo que conviene. Una tarea pequeña se
revierte entera sin dolor; 180 entradas generadas de una vez ofrecen un único
punto de retroceso de todo o nada. La tentación aparece porque el volumen se
produce de golpe —un generador, una transcripción larga— y commitear a mitad
parece artificial.

**How to apply:** al planificar una historia de volumen, fijar los cortes de
commit por **bloques verificables** (una región, un subsistema) y commitear cada
bloque con el gate en verde, aunque el trabajo se haya producido de una tacada.
Si el plan ya declara tres bloques, tres commits: el plan es el compromiso, y
agruparlos es un desvío que hay que anotar, no una comodidad.

Relacionado: [[asset-tests-observe-bytes]].
