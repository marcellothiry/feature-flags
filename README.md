# Feature Flags from Scratch

This is the complementary repository for our video series Implementing Feature Flags from Scratch.
Our goal is to develop a complete solution (minus the front-end, at least for now) to manage and use Feature Flags (also
known as Feature Toggles) without using any existing frameworks or tools to handle them.
But we don’t intend to create a new Feature Flags framework or product here (you can, however, use it depending on your
use case).
The idea is to learn more about feature flags, programming and the technologies we are using.

When we are finished, we should have functions for checking flag’s status based on the flag's name and user's group,
caching and auto-refreshing, loaders for different data sources, and easy support for switching between new and legacy
features.
We are going to write a local MongoDB loader and a REST service loader (also using MongoDB to manage the persistence).

This project is using:

- [TypeScript](https://www.typescriptlang.org/): the main programming language used in this project.
- [Lerna](https://lerna.js.org/): a monorepo tool to help us to manage our NPM packages and their dependencies.
- [Verdaccio](https://verdaccio.org/): a simple, zero-config-required local private NPM registry, so we can use Lerna to
  publish our packages.
- [Vitest](https://vitest.dev/): a fast unit test framework powered by [Vite](https://vitejs.dev/).
- [Fastify](https://www.fastify.io/): a web framework to build our Feature Flags REST service.
- [MongoDB](https://www.mongodb.com/): our solution matches perfectly with JSON objects. However, our final version will
  allow us to use any
  kind of data source since the loader follows the expected interface.

### Installation and running the tests

After downloading or cloning the project (from root):

```
npm install
npx lerna run build
npx lerna run test
```

If you want to test or build a specific package, you can use the option `--scope`:

```
npx lerna run build --scope=<package-name>
npx lerna run test --scope=<package-name>
```

### Part 1 ([v0.0.1](https://github.com/marcellothiry/fflags/releases/tag/v0.0.1))

- Short intro about this project and feature flags
- Setting the workspace up in a monorepo setup using Lerna.
- Creating two simple packages to demonstrate how we can link them in our workspace.
- Using Vitest to implement our initial (very basic) tests.

### Part 2 ([v0.0.2](https://github.com/marcellothiry/fflags/releases/tag/v0.0.2))

- Presentation about the structure to be used (DB and memory)
- Presentation about how to translate the structures to TypeScript
- Implementing types and tests
- Implementing the first version of FFlagsClient class

