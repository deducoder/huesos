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

```bash
./scripts/check-integration  # navegador real contra el build (minutos) — antes de hacer push
```

`check-integration` es el segundo punto de entrada que la convención de gates
contempla: arranca el build de producción, abre Chromium con Playwright y
comprueba que el esqueleto carga, se puede seleccionar desde decenas de puntos
distintos, resalta el lado correcto en un hueso par, y no pide nada a ningún
tercero. Nace de b2.1 y b2.2, dos defectos que ninguna prueba unitaria podía
ver. No corre en cada commit —tarda un orden de magnitud más que `check`— sino
antes de empujar.

The gates above do not run a single test. A task's RED step does, so this project's
way to run one lives here too — not a gate, just the command the loop needs:

```bash
npx vitest -t "nombre del test"     # uno solo
npm run test:watch                  # en watch, mientras dura el ciclo RED-GREEN
```

Los gates corrían con `--passWithNoTests` mientras el repositorio no tenía
tests. La bandera se quitó al llegar el primero, en la historia e1.1: desde
entonces, cero tests es un gate rojo.

Everything else about how work is organized (branches, commit format, where
artifacts land) is in **Conventions** below.

## Structure

| Path | What lives here |
|------|-----------------|
| `src/data/` | Catálogo de los 206 huesos y el SVG del esqueleto |
| `src/domain/` | Agrupación por región, estado de selección, resolución malla→hueso — TypeScript puro |
| `src/features/explore/` | La vista de estudio: lista, escena y panel sobre un estado |
| `public/draco/` | Decodificador Draco servido desde el propio origen |
| `src/components/` | Navegador accesible, panel de identidad, escena 3D |
| `tests/` | Setup de test y pruebas que cruzan módulos; el test unitario vive junto a su fuente |
| `scripts/` | Gates y herramientas del activo 3D (inventario, poda de texturas) |
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
