# ResourVereign
## Pluggable resources allocation automation platform

### Scripts

**Development Scripts:**
- `start:dev:client`: Starts the client in development mode.
- `start:dev:server`: Starts the server in development mode.
- `start:dev`: Starts both client and server in development mode concurrently.

**Production Scripts:**
- `start:prod:server`: Starts the server in production mode.

**Test Scripts:**
- `test:plugin-types`: Runs tests for plugin-types workspace.
- `test:common`: Runs tests for common workspace.
- `test:client`: Runs tests for client workspace.
- `test:server`: Runs tests for server workspace.
- `test:watch:plugin-types`: Watches for changes and runs tests for plugin-types workspace.
- `test:watch:common`: Watches for changes and runs tests for common workspace.
- `test:watch:client`: Watches for changes and runs tests for client workspace.
- `test:watch:server`: Watches for changes and runs tests for server workspace.

**Build Scripts:**
- `build:watch:plugin-types`: Watches for changes and builds plugin-types workspace.
- `build:watch:common`: Watches for changes and builds common workspace.
- `build:check:plugin-types`: Checks build for plugin-types workspace.
- `build:check:common`: Checks build for common workspace.
- `build:check:client`: Checks build for client workspace.
- `build:check:server`: Checks build for server workspace.
- `build:plugin-types`: Builds plugin-types workspace.
- `build:common`: Builds common workspace.
- `build:client`: Builds client workspace.
- `build:server`: Builds server workspace.
- `build:libs`: Builds both libraries plugin-types and common.
- `build:apps`: Builds both client and server.
- `build`: Executes the build script.
- `build:check`: Checks builds for common, client, and server workspaces.

**Utility Scripts:**
- `run:parallel`: Executes the run-parallel script.
- `clean:install [ --delete-lock | -dl ]`: Executes the clean-install script. Optionally, use --delete-lock or -dl to delete the yarn.lock file and generate one from scratch.
- `clean:build`: Executes the clean-build script.
- `clean`: Cleans both installation and build concurrently.

**Husky:**
- `prepare`: Installs husky.