# Story e5.5: Privacy guardrail, actually gated — Scope

## User story

As a estudiante de medicina,
I want la certeza de que lo que la aplicación aprende de mis errores no sale de
mi navegador,
so that pueda estudiar sin cuenta y sin confiar en la palabra de nadie.

Y, del lado de quien mantiene el proyecto: que introducir una petición de red
ponga el gate en rojo, en vez de descubrirse en producción.

## Acceptance criteria

```gherkin
Given la aplicación tal como está hoy
When se corre `./scripts/check`
Then el gate pasa

Given que alguien introduce un `fetch` en el código de la aplicación
When se corre `./scripts/check`
Then el gate falla, nombrando el archivo

Given la aplicación montada y en uso, incluido responder en el modo test
When se observan `fetch`, `XMLHttpRequest` y `navigator.sendBeacon`
Then ninguno se ha llamado
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `src/` tal como está | correr el gate | verde |
| un `fetch('https://analitica.example')` añadido a `App.tsx` | correr el gate | rojo, nombrando `App.tsx` |
| navegar a Test, responder una pregunta | contar llamadas de red | 0 |

## In scope

- La comprobación que `must-privacy-006` declara y que no existe: parte del
  `./scripts/check`, no solo de la suite de navegador.
- **Dos ángulos**, porque atrapan cosas distintas:
  - *estático*, sobre el código propio del proyecto: nadie escribió `fetch`,
    `XMLHttpRequest` ni `sendBeacon`;
  - *en ejecución*, sobre la aplicación montada y usada: nadie los llamó —
    incluidas las dependencias.
- Que la demostración de que el gate atrapa el defecto quede **hecha y
  registrada**, no supuesta.

## Out of scope

- **Analizar el bundle construido** en busca de `fetch` — el bundle contiene
  código de terceros que nunca se ejecuta, así que un grep sobre él produce
  falsos positivos. El diseño de la épica ya lo descartó por eso.
- **Bloquear la carga del propio activo `.glb`** desde el mismo origen — es un
  recurso de la aplicación, no una petición a un tercero, y la suite de
  navegador de s1 ya vigila que no haya tráfico externo.
- **Una política de red del navegador (CSP)** — es despliegue, no gate, y
  ningún requisito la pide.

## Done when

- `./scripts/check` falla si alguien introduce `fetch`, `XMLHttpRequest` o
  `sendBeacon` en el código de la aplicación.
- `./scripts/check` falla si algo los llama al usar la aplicación, incluido
  responder en el modo test.
- La demostración —introducir el defecto, ver el gate rojo, revertir— está
  hecha y registrada en `progress.md` con su salida.
- `./scripts/check` en verde con el código actual.

## Notes

- Va última en la épica siguiendo el patrón que E1 dejó aprendido
  (`untestable-layers-go-last`): lo más difícil de probar, al final, sobre algo
  que ya funciona.
- Y la demostración es obligatoria por lo aprendido en s1
  (`a-reintroduced-defect-must-actually-break`): un gate que nadie vio ponerse
  rojo no es un gate, es una intención.
