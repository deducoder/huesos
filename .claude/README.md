# gemba, copiado en el repositorio

Este directorio lleva el método **gemba (GDD)** dentro del propio repositorio, en
vez de depender de que el plugin esté instalado en la máquina. Así funciona igual
en un Claude Code remoto, en un contenedor o en el equipo de otra persona.

## Qué hay

| Ruta | Qué es |
|---|---|
| `skills/` | Las 31 skills del método, una por directorio |
| `conventions/` | Las convenciones que las skills citan: git, work, artifacts, tracker, docs-publishing, memory, gates, authoring |
| `core-template.md` | El core **sin rellenar**, con sus cuatro tokens. `project-create` y `project-onboard` lo usan como plantilla |
| `memory/` | La memoria del asistente, versionada (ver la convención de memoria) |

El core **ya rellenado** de este proyecto es el `CLAUDE.md` de la raíz, y es el
que se carga en cada sesión.

## Cómo se invocan

Sin plugin, las skills **pierden el prefijo**:

```
/gemba:story-start   →   /story-start
/gemba:bug-start     →   /bug-start
```

Los nombres son los mismos y el frontmatter `name` de cada una coincide con su
directorio, así que el descubrimiento es directo.

## Qué cambió respecto del plugin

La copia es fiel salvo en lo que **tenía que** cambiar para funcionar fuera de él:

1. **Estructura aplanada.** El plugin agrupa por familia
   (`skills/story/story-start/`); aquí cada skill está a un nivel
   (`skills/story-start/`), que es el formato que Claude Code descubre con
   seguridad. Los assets de cada skill viajan con ella.
2. **Referencias reescritas.** Al aplanar, `../../../conventions/` pasó a
   `../../conventions/` y `../../reviews/quality-review/SKILL.md` a
   `../quality-review/SKILL.md`. Se verificaron **las 80 rutas relativas** de
   todos los archivos: ninguna quedó rota.
3. **`${CLAUDE_PLUGIN_ROOT}` ya no existe.** Donde señalaba al core del plugin,
   ahora señala a `core-template.md`.
4. **`session-start` avisa de que la comparación con la caché del plugin no
   aplica** aquí: las skills se ejecutan desde el repositorio, así que no hay
   snapshot que pueda quedarse atrás.

**No se copiaron los comandos** `/gemba:install` y `/gemba:update`: sirven para
cablear el core en un `CLAUDE.md`, y este repositorio ya lo tiene cableado.

## Cómo volver a sincronizar

La copia es una foto, no un enlace: si el plugin avanza, esto no se entera. Para
actualizar, repetir el mismo procedimiento desde el plugin instalado —copiar
`skills/` aplanando un nivel y `conventions/` tal cual, reescribir las tres
familias de rutas, y **volver a verificar que toda ruta relativa resuelve**, que
es lo único que prueba que la copia sigue siendo coherente.

Origen de esta copia: `gemba/gemba/7f598d7f7a88`.
