# ResourVereign Server
## Server for ResourVereign

### Scripts

- `start:dev`: Uses `nodemon` to watch the `src` and `config` directories and starts the server with `tsx` in development mode when there are changes to TypeScript or JSON files.
- `start:prod`: Starts the server using `tsx` in production mode.
- `build`: Compiles the TypeScript files as per the configuration in `tsconfig.json`.
- `build:check`: Checks the TypeScript files for type errors without emitting any output files.
- `test`: Runs tests using `jest`, allowing for a pass even if no tests are found.
- `test:watch`: Continuously runs `jest` in watch mode to automatically rerun tests on changes.
- `lint:fix`: Automatically fixes linting issues in TypeScript files within the `src` directory using `eslint`.
- `lint`: Lints TypeScript files in the `src` directory without automatically fixing issues.
- `prettify`: Formats code in the `src` directory using `prettier`.
- `command`: Executes a CLI command using `tsx`.