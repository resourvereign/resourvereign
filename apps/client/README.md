# ResourVereign Client
## Client for ResourVereign

### Scripts

- `start:dev`: Starts the development server using `vite`.
- `build`: Compiles TypeScript files with `tsc` and then builds the project with `vite`.
- `build:check`: Checks TypeScript files for type errors without emitting output and builds the project using a specific `vite` config that doesn't write outputs.
- `test`: Runs tests using `vitest` with coverage.
- `test:watch`: Continuously runs `vitest` tests in watch mode to automatically rerun on changes.
- `test:ui`: Starts `vitest` with a user interface.
- `lint:fix`: Automatically fixes linting issues in `src` and `utils` directories for TypeScript and TypeScript JSX files using `eslint`. It reports unused eslint-disable directives and ensures no warnings.
- `lint`: Lints files in `src` and `utils` directories for TypeScript and TypeScript JSX files using `eslint` without automatically fixing issues. It reports unused eslint-disable directives and ensures no warnings.
- `preview`: Starts a server to preview the production build using `vite`.
- `prettify`: Formats code in the `src` directory and subdirectories using `prettier` for various file types including `.cjs`, `.js`, `.ts`, `.tsx`, `.json`, `.scss`, and `.css`.

