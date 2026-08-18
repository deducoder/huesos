---
name: shortened-labels-break-label-in-name
description: Si el texto visible se acorta y el aria-label conserva el largo, el control por voz deja de encontrar el botón (WCAG 2.5.3).
metadata:
  type: reference
---

Divergir el texto visible del nombre accesible incumple **WCAG 2.5.3 «Label in
Name» (nivel A)**: el nombre accesible tiene que *contener* el visible, porque
quien usa control por voz dice lo que lee en pantalla. En e9.5 (2026-08-18) el
botón mostraba «Falange proximal 2.º mano derecha» y anunciaba «falange
proximal del segundo dedo de la mano derecha» — decir lo visible no activaba
nada. Alcance: 75 de 120 nombres.

**Why:** el razonamiento habitual («un lector de pantalla no tiene problema de
espacio, que oiga el nombre largo») solo piensa en lectores de pantalla. Para
control por voz las dos formas no son equivalentes: son incompatibles.

**How to apply:** cuando un diseño acorte texto visible, el `aria-label` debe
**empezar por el visible** y añadir lo que falte, no sustituirlo:
«Falange proximal 2.º mano derecha, falange proximal del segundo dedo de la
mano». Evaluarlo *antes* de escribir el ADR que fija la divergencia.
