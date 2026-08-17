---
name: contracts-belong-in-gates-not-inventories
description: Un contrato que se declara en una épica —«ningún componente hace X»— se escribe como gate en la primera historia que lo enuncia; contarlo a mano subestima siempre, y en e7.1 lo hizo dos veces seguidas.
metadata:
  type: process
---

ADR-007 declaró que ningún componente vuelve a escribir un color a mano. El
inventario de ese contrato se hizo tres veces en e7.1, cada una más cuidadosa
que la anterior:

| Momento | Cuenta | Cómo |
|---|---:|---|
| `scope.md` | 23 líneas / 5 archivos | grep a mano |
| `design.md` | 35 líneas / 6 archivos | grep a mano, corregido |
| el gate | **46 utilidades** / 6 archivos | ejecutando |

Y el gate siguió encontrando después: `text-white` en `BoneIdentity.tsx:34`, que
ningún grep había listado porque los dos buscaban `slate|sky|amber` y ese color
no pertenece a ninguna familia numerada. En la revisión de calidad apareció un
cuarto hueco —los valores arbitrarios `bg-[#ff0000]`— que solo se vio leyendo el
patrón como código, no como intención.

**Por qué importa:** el inventario manual no falla por descuido, falla por
construcción. Cada grep codifica lo que quien lo escribe ya sospecha, así que
mide su propia hipótesis. El gate mide el código. Y hay una asimetría de coste:
escribirlo en la primera historia lo convierte en la red de las nueve
siguientes; escribirlo en la tercera significa que dos historias ya pasaron sin
él.

**How to apply:** cuando una épica o un ADR enuncia un contrato negativo
—«ninguno», «nunca», «cero»—, la primera tarea de la primera historia que lo
toca es el gate que lo verifica, no el conteo que lo estima. El rojo inicial
**es** el inventario, y sale gratis y completo. Emparejarlo siempre con
[[a-check-needs-a-check-that-it-looked]], porque su caso feliz es una lista
vacía.
