# Story e2.2: Accessible navigator — Progress

| Task | Status | Commit | Nota |
|------|:------:|--------|------|
| T1 · Estado de selección | done | `b3d81aa` | Dominio puro: alternar, sustituir, buscar |
| T2 · Navegador accesible | done | `5c1e0f4` | 6 aserciones, todas por nombre accesible y rol |
| T3 · Prueba de integración manual | done | — | `npm run build` compila y el servidor sirve la aplicación; HTTP 200 en `/src/main.tsx` |

## Desvíos respecto del plan

- **El linter de accesibilidad rechazó `role="group"`** sugiriendo `<fieldset>`,
  que es de formularios y aquí no encaja. Se cambió a una `<ul>` con
  `aria-labelledby`: un lector anuncia «lista, N elementos» con el nombre de la
  región, que informa más que un grupo genérico. **El test se modificó con el
  componente** —de `getAllByRole('group')` a `getAllByRole('list')`— porque
  cambió el diseño accesible, no para hacerlo pasar.
- **La lista se montó en `src/App.tsx`** para poder verificarla de verdad. Es
  trabajo que rozaba e2.6, pero sin montarla no había integración que probar.
  e2.6 la recompondrá junto a la escena.
- **La verificación de teclado es la del test**, con `userEvent`, que emite
  eventos reales de teclado. **No se probó con un lector de pantalla real**: eso
  queda sin cubrir y se dice aquí en vez de darlo por hecho.
