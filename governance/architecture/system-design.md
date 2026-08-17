# System design: huesos-mono

Internal structure — the layers and the modules in each.

## Layers

| Layer | Modules | Description |
|-------|---------|-------------|
| Datos | `data/catalog`, `data/skeleton.svg` | El catálogo de los 206 huesos y el SVG del esqueleto. Datos puros, sin lógica ni dependencias de React |
| Dominio | `domain/answer-check`, `domain/quiz`, `domain/progress` | Normalización y validación de respuestas, elección del siguiente hueso a preguntar, cálculo del progreso. TypeScript puro, sin DOM: es la capa donde vive casi todo el test unitario |
| Estado | `state/session` | Estado de la sesión de estudio y su persistencia en `localStorage`. Único punto que toca el almacenamiento |
| Vistas | `features/explore`, `features/bone`, `features/quiz` | Las tres experiencias: explorar el esqueleto, ver un hueso, responder preguntas. Componen dominio y componentes |
| Componentes | `components/Skeleton`, `components/BoneShape`, `components/AnswerInput` | Piezas de presentación reutilizables, sin conocimiento del modo de estudio en que se usan |

## Key contracts

Interfaces and invariants that must hold across modules (one line each).

- Todo hueso del catálogo tiene un `id` estable y único, y ese `id` es el mismo que identifica su región en el SVG del esqueleto.
- La validación de una respuesta es una función pura `(respuesta, hueso) => resultado`: sin estado, sin fecha, sin acceso a almacenamiento.
- La normalización de la respuesta escrita se aplica igual al texto del usuario y a los nombres del catálogo, de modo que la comparación sea siempre entre formas normalizadas.
- La capa de dominio no importa nada de React, del DOM ni de `localStorage`; la dependencia va siempre de vistas hacia dominio, nunca al revés.
- En modo test, los nombres del hueso preguntado no se pasan a la capa de vistas hasta que la respuesta ha sido enviada.
- El acceso a `localStorage` está encapsulado en `state/session`; ningún componente lo lee ni lo escribe directamente.
