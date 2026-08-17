# System context: huesos-mono

The external actors and systems this project talks to, and how.

| Interface | Direction | Actor / System | Protocol | Purpose |
|-----------|-----------|----------------|----------|---------|
| Interfaz de estudio | in | Estudiante de medicina | HTTP / navegador | Explorar el esqueleto, responder preguntas, recibir la corrección |
| Entrega de la aplicación | out | Hosting estático | HTTPS | Servir el bundle; no hay servidor de aplicación ni API propia |
| Progreso local | out | `localStorage` del navegador | Web Storage API | Persistir aciertos y fallos por hueso, en el dispositivo |
| Catálogo anatómico | in | Fuentes de osteología (Terminologia Anatomica, atlas de referencia) | Manual, en tiempo de autoría | Origen de nombres, sinónimos y regiones; se incorpora al repositorio, no se consulta en ejecución |

## Lo que deliberadamente no existe

No hay backend propio, base de datos, cuentas de usuario, telemetría ni ninguna
petición de red en tiempo de ejecución (must-privacy-006). El catálogo viaja
dentro del bundle. La consecuencia aceptada: el progreso no se sincroniza entre
dispositivos, y borrar los datos del navegador lo pierde.
