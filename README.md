# huesos-mono

Aplicación web para que estudiantes de medicina memoricen los 206 huesos del
cuerpo humano: un esqueleto que se explora hueso por hueso, y un modo test que
pregunta, valida lo que escribís y te corrige en el momento. Sin cuenta, sin
instalación, sin servidor. El porqué y los resultados que persigue están en
[`governance/vision.md`](governance/vision.md).

## Quick start

```bash
nvm use            # Node 24 (versión fijada en .nvmrc)
npm install
npm run dev        # http://localhost:5173
```

No hace falta `.env`, ni servicios levantados, ni credenciales: la aplicación no
tiene backend y el catálogo de huesos viaja dentro del repositorio.

Node se instala con [nvm](https://github.com/nvm-sh/nvm) y **no está en el PATH
de shells no interactivos** — de ahí el `nvm use`. Los scripts de `scripts/`
cargan nvm por su cuenta, así que no necesitan que lo hagas antes.

## Development

Quality gates. **Run `./scripts/check` before every commit.** Nothing enforces
it — a red check will not stop a commit — so run it yourself while working:

```bash
./scripts/check              # lint · format · types · unit tests (seconds)
```

No hay `./scripts/check-integration`: no existe ninguna suite que necesite
servicios levantados. Si algún día la hay, se agrega ahí y corre al hacer push.

The gates above do not run a single test. A task's RED step does, so this project's
way to run one lives here too — not a gate, just the command the loop needs:

```bash
npx vitest -t "nombre del test"     # uno solo
npm run test:watch                  # en watch, mientras dura el ciclo RED-GREEN
```

Los gates corren con `--passWithNoTests` **solo mientras el repositorio no tiene
tests**, que es hoy. La primera historia trae el primer test y esa bandera se
quita: a partir de ahí, cero tests es un gate rojo.

Everything else about how work is organized (branches, commit format, where
artifacts land) is in **Conventions** below.

## Structure

| Path | What lives here |
|------|-----------------|
| `src/data/` | Catálogo de los 206 huesos y el SVG del esqueleto |
| `src/domain/` | Validación de respuestas, elección de preguntas, progreso — TypeScript puro |
| `src/state/` | Estado de la sesión y su persistencia en `localStorage` |
| `src/features/` | Las tres experiencias: explorar, ficha de hueso, test |
| `src/components/` | Piezas de presentación reutilizables |
| `tests/` | Setup de test y pruebas que cruzan módulos; el test unitario vive junto a su fuente |
| `scripts/` | Gate entry points (see Development) |
| `governance/` | Vision, requirements, guardrails, architecture (see below) |
| `work/` | Work in progress — one directory per epic / story / bug / spike |
| `records/decisions/` | ADRs — the decisions and their rationale |
| `.claude/memory/` | Memoria del asistente, versionada con el repositorio |

## Governance

The durable answers live here, one question per document:

| Document | Answers |
|----------|---------|
| `governance/vision.md` | Why this exists, and the outcomes it aims for |
| `governance/prd.md` | What it must do (`RF-XX` requirements) |
| `governance/guardrails.md` | The quality bars, and how each is verified |
| `governance/backlog.md` | The epics that deliver the vision |
| `governance/architecture/system-context.md` | External actors and interfaces |
| `governance/architecture/system-design.md` | Internal layers and modules |

## Conventions

El método de trabajo de este proyecto es **gemba (GDD)**, y vive completo en
[`CLAUDE.md`](CLAUDE.md) en la raíz: formato de commit, modelo de ramas,
ciclo de cada tipo de trabajo, dónde aterriza cada artefacto y los
no-negociables. Es la única fuente — este README no lo repite, lo señala.
