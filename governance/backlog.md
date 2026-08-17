# Backlog: huesos-mono

The epics that deliver the vision, roughly in order.

| Epic | Name | Description |
|------|------|-------------|
| E1 | Activo anatómico | Conseguir o construir el SVG del esqueleto con cada hueso como región identificable, y definir el esquema del catálogo. Es el cuello de botella real del proyecto y va primero, precedido de un spike que decida entre adaptar un SVG de dominio público o dibujarlo |
| E2 | Explorar el esqueleto | Vista del esqueleto completo, selección de un hueso, resaltado y nombre en ambas nomenclaturas (RF-01, RF-02) |
| E3 | Ficha del hueso | Vista individual del hueso aislado, con región anatómica y datos del catálogo (RF-03) |
| E4 | Motor de test | Modo test sobre esqueleto y sobre hueso aislado, respuesta escrita, validación tolerante y corrección explícita (RF-04 a RF-07) |
| E5 | Progreso y repaso dirigido | Registro persistente de aciertos y fallos por hueso, y selección de preguntas que prioriza los huesos fallados (RF-09) |
| E6 | Condición de lanzamiento | Cerrar `RF-08`: decidir qué significa "catálogo completo" cuando el modelo 3D no dibuja siete de los 206 huesos, dejarlo escrito en el requisito y afirmarlo con una prueba |

## Nota de secuencia

La nota original decía que E6 era contenido y no software, y que el lanzamiento
esperaría a que el catálogo llegara a 206. **El catálogo llegó a 206 en E1**, con
las siete entradas sin geometría declaradas como excepción explícita (ADR-001,
punto 4). Lo que quedaba no era contenido sino una decisión: `RF-08` exigía
geometría para esos siete y por tanto era imposible de cumplir por
construcción. E6 la toma (ADR-006) y deja el requisito diciendo lo decidido.
