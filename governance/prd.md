# PRD: huesos-mono

What the product must do. One requirement per `RF-XX`, observable and testable.

### RF-01: Visualización del esqueleto completo

El sistema muestra un esqueleto humano completo en una sola vista, con cada
hueso como una región gráfica propia y diferenciable. La vista permite acercar y
desplazarse para alcanzar los huesos pequeños. Observable: cada uno de los
huesos del catálogo tiene una región propia identificable en la vista, y ninguna
región queda fuera del alcance del usuario en un viewport de 360 px de ancho.

### RF-02: Selección e identificación de un hueso

Al seleccionar una región del esqueleto, el sistema la resalta y muestra el
nombre del hueso en español y su término en Terminologia Anatomica. Observable:
seleccionar la región del fémur muestra «fémur / os femoris» y deja esa región
visualmente distinguida del resto.

### RF-03: Ficha individual de un hueso

El sistema muestra un hueso aislado del resto del esqueleto, con su nombre en
ambas nomenclaturas, la región anatómica a la que pertenece y cuántos ejemplares
tiene el cuerpo (par o impar). Observable: desde la selección de RF-02 se llega a
la ficha, y la ficha es alcanzable también sin pasar por el esqueleto completo.

### RF-04: Modo test sobre el esqueleto completo

El sistema presenta el esqueleto sin ninguna etiqueta visible, señala un hueso
concreto y pide su nombre. Observable: en modo test ningún nombre de hueso está
presente en el DOM antes de que el usuario responda, y hay exactamente un hueso
señalado por pregunta.

### RF-05: Modo test sobre hueso individual

El sistema presenta un hueso aislado, sin el esqueleto alrededor y sin etiqueta,
y pide su nombre. Observable: la misma pregunta de RF-04 sobre la vista de RF-03,
sin contexto posicional que ayude a deducir la respuesta.

### RF-06: Respuesta escrita con validación tolerante

El estudiante responde escribiendo el nombre. El sistema da por correcta la
respuesta en español o en Terminologia Anatomica, indistintamente, ignorando
mayúsculas, tildes, espacios sobrantes y artículos iniciales, y aceptando los
sinónimos registrados para ese hueso. Observable: para el hueso «fémur»,
`FEMUR`, `femur`, `el fémur` y `os femoris` se validan todas como correctas;
`tibia` no.

### RF-07: Corrección explícita del error

Ante una respuesta incorrecta, el sistema lo dice, muestra el nombre correcto en
ambas nomenclaturas y deja el hueso resaltado en su posición dentro del
esqueleto. Observable: tras fallar, el nombre correcto y la ubicación están
ambos a la vista sin ninguna acción adicional del usuario.

### RF-08: Catálogo completo de 206 huesos

El catálogo cubre los 206 huesos del esqueleto humano adulto, cada uno con
nombre en español, término en Terminologia Anatomica, sinónimos aceptados,
región anatómica y, **o bien** la región gráfica que le corresponde en el
esqueleto, **o bien** una razón documentada de por qué el modelo 3D no lo
incluye.

*Completo* se refiere a la cobertura del **catálogo**, no a la del modelo: el
esqueleto adulto tiene 206 huesos y el catálogo los tiene todos; el modelo 3D
dibuja 199 de ellos, y las siete entradas restantes —los seis huesecillos del
oído medio y el hioides— dicen por qué no. La geometría es un atributo del
activo 3D, no de la entrada. Ver
[ADR-006](../records/decisions/adr-006-what-complete-catalog-means.md), que
recoge las cuatro opciones consideradas y por qué se rechazaron las otras tres.

Observable: una prueba automática cuenta 206 entradas, verifica que no hay
identificadores duplicados ni dos entradas del mismo hueso y lado —los huesos
pares comparten nombre por diseño, y los distingue la lateralidad—, y verifica
que **ninguna entrada queda sin región gráfica y sin razón de ausencia** —
`src/data/catalog.coverage.test.ts`, prueba *"cumple la condición de
lanzamiento: geometría o razón, nunca ninguna"*.

**Este requisito es la condición de lanzamiento del producto** (decisión
explícita del proyecto, agosto 2026): no se publica una versión con el catálogo
incompleto.

### RF-09: Progreso persistente por hueso

El sistema recuerda, por hueso, cuántas veces se acertó y cuántas se falló, y
conserva ese registro entre sesiones en el mismo navegador, sin cuenta de
usuario. Observable: tras responder y recargar la página, el registro del hueso
respondido conserva el resultado anterior.
