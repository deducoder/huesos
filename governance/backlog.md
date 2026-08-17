# Backlog: huesos-mono

The epics that deliver the vision, roughly in order.

| Epic | Name | Description |
|------|------|-------------|
| E1 | Activo anatómico | Conseguir o construir el SVG del esqueleto con cada hueso como región identificable, y definir el esquema del catálogo. Es el cuello de botella real del proyecto y va primero, precedido de un spike que decida entre adaptar un SVG de dominio público o dibujarlo |
| E2 | Explorar el esqueleto | Vista del esqueleto completo, selección de un hueso, resaltado y nombre en ambas nomenclaturas (RF-01, RF-02) |
| E3 | Ficha del hueso | Vista individual del hueso aislado, con región anatómica y datos del catálogo (RF-03) |
| E4 | Motor de test | Modo test sobre esqueleto y sobre hueso aislado, respuesta escrita, validación tolerante y corrección explícita (RF-04 a RF-07) |
| E5 | Progreso y repaso dirigido | Registro persistente de aciertos y fallos por hueso, y selección de preguntas que prioriza los huesos fallados (RF-09) |
| E6 | Catálogo completo | Completar las 206 entradas región por región hasta la condición de lanzamiento, con la prueba de integridad en verde (RF-08) |

## Nota de secuencia

E6 es contenido, no software: se puede avanzar en paralelo a E2-E5 en cuanto E1
fije el esquema del catálogo. El software queda terminado y probado con un
catálogo parcial; el lanzamiento espera a que E6 llegue a 206. Esa espera es una
decisión tomada a conciencia del proyecto, no un efecto secundario del plan.
