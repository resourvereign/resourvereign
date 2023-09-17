# ResourVereign Common
## Common types and utilities for ResourVereign

### Scripts

- `build`: Compiles the TypeScript files. Optionally, it clears the `./dist` directory unless the `NOCLEAN` variable is set to "1".
- `build:watch`: Uses `nodemon` to watch the `src` directory and recompiles TypeScript files on changes without clearing the `./dist` directory.
- `build:check`: Checks the TypeScript files for type errors without emitting any output files.
- `test`: Runs tests using `jest`, allowing for a pass even if no tests are found.
- `test:watch`: Continuously runs `jest` in watch mode to automatically rerun tests on changes.
- `lint:fix`: Automatically fixes linting issues in TypeScript files within the `src` directory using `eslint`.
- `lint`: Lints TypeScript files in the `src` directory without automatically fixing issues.
- `prettify`: Formats the code in the `src` directory using `prettier`.