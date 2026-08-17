---
name: pairing-doesnt-imply-distinguishing
description: Que un dato sea par (tiene lado derecho/izquierdo) no implica que valga la pena distinguir el lado en la interfaz — si ambos lados son indistinguibles en todo lo observable, ofrecer la elección es ruido, no información.
metadata:
  type: process
---

En e7.4, el navegador de huesos empareja cada hueso par (172 de 206) con su
opuesto en una fila con dos píldoras de lado. El diseño sabía que existían 34
huesos impares y 172 pares, y sabía —por separado— que 6 de esos pares
(martillo, yunque, estribo) no tienen geometría en ningún lado. Lo que nadie
cruzó hasta que el usuario lo vio en pantalla: esos 6 pares son **totalmente
indistinguibles en todo lo que se puede mostrar** —mismo motivo de ausencia,
nunca aparecen en la escena, excluidos del modo test— así que ofrecer «elegí
derecho o izquierdo» no da ninguna información real, solo dos botones
idénticos en apariencia y efecto.

**Por qué importa:** «es un dato par» y «vale la pena que la interfaz
distinga sus dos valores» son preguntas distintas, y la primera no responde la
segunda. El patrón general —tratar todo par igual— es correcto para 166 de los
172 pares, y falla exactamente donde la representación colapsa: cuando el
resto del sistema (la escena 3D, el modo test) ya trata ambos lados como
indistinguibles.

**How to apply:** al agrupar o presentar pares, preguntar explícitamente:
¿hay algo —una vista, un dato, un flujo— que ya distinga estos dos lados en
algún lugar de la aplicación? Si la respuesta es no para *todos* los lados
de un par concreto, colapsar es lo honesto; si la respuesta es sí para
*algunos*, el patrón general debe aplicar y el caso raro necesita su propio
tratamiento, no una generalización que lo ignore. Cruzar los datos que ya se
conocen por separado (aquí: `side` y `meshName`) antes de dar el patrón por
completo.
