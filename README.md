# Feature Flags from Scratch

This is the complementary repository for our video
series [Implementing Feature Flags from Scratch](https://www.youtube.com/watch?v=73NQuTACyus) (channel
[@fromDev2Dev](https://www.youtube.com/@fromDev2Dev)).

[![Feature Flags from Scratch Series](https://img.youtube.com/vi/73NQuTACyus/0.jpg)](https://www.youtube.com/watch?v=73NQuTACyus)

* [Part 1](https://www.youtube.com/watch?v=73NQuTACyus)
* [Part 2](https://www.youtube.com/watch?v=EGdYfnhzni4)
* [Part 3](https://www.youtube.com/watch?v=p6cKvQY6zMY)
* [Part 4](https://www.youtube.com/watch?v=c_J7BNOobgI)
* [Part 5](https://www.youtube.com/watch?v=91V5bL-O4Os)
* [Part 6](https://www.youtube.com/watch?v=Fyfp0oEWD6w)
* Part 7: to be released

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

To test or build a specific package, the option `--scope` can be used:

```
npx lerna run build --scope=<package-name>
npx lerna run test --scope=<package-name>
```

### Publishing

Before following these steps, the remote repository must already exist. Lerna has options to skip
git commands as tagging and pushing, but we are not covering this here.

To install Verdaccio globally (look at its main page to other options), run the command:

```
npm install --location=global verdaccio
```

Now run verdaccio in a terminal. If the default options are being used, it must be running at http://localhost:4873).
Before using Lerna to publish the packages, run the following commands:

```
npm adduser --registry http://localhost:4873
npm config set @fflags:registry http://localhost:4873
```

Now, just run:

```
npx lerna publish
```

Choose between the versioning options and confirm. That's it, the packages should be updated in the local registry and
a new release should appear in the git repository. We have this steps explained at the end of our video series part 4.

### Part 1 ([v0.0.1](https://github.com/marcellothiry/feature-flags/releases/tag/v0.0.1))

- Short intro about this project and feature flags
- Setting the workspace up in a monorepo setup using Lerna.
- Creating two simple packages to demonstrate how we can link them in our workspace.
- Using Vitest to implement our initial (very basic) tests.

### Part 2 ([v0.0.2](https://github.com/marcellothiry/feature-flags/releases/tag/v0.0.2))

- Presentation about the structure to be used (DB and memory)
- Presentation about how to translate the structures to TypeScript
- Implementing types and tests
- Implementing the first version of FFlagsClient class

### Part 3 ([v0.0.3](https://github.com/marcellothiry/feature-flags/releases/tag/v0.0.3))

- Tests for class FFlagsClient
- Adding utility method isFlagEnabled
- More tests
- Adding value to FeatureFlagContent (multivariate feature flags)
- More tests
- Publishing with Lerna and Verdaccio

### Part 4 ([v0.0.4](https://github.com/marcellothiry/feature-flags/releases/tag/v0.0.4))

- Adding generic types to support the new utility methods in FFlagsClient
- Adding utility methods to get the feature function to run according to the flag's status (sync and async)
- Adding new tests for FFlagsClient
- Adding the ability to override a feature flag
- More tests
- Our client class is pretty much finished at the end of this video

### Part 5 ([v0.0.5](https://github.com/marcellothiry/feature-flags/releases/tag/v0.0.5))

- Adding new package (loader for MongoDB).
- Using [Mongoose](https://mongoosejs.com/) as our ODM (Object Data Modeling) as a peer dependency.
- Adding and exporting the feature flags Model.
- Adding the MongoDBLoader class.
- Adding tests to check our model and loader, using
  a [MongoDB Memory Server](https://www.npmjs.com/package/mongodb-memory-server).
- Adding Mongoose as a PeerDependency.

### Part 6 ([v0.0.7](https://github.com/marcellothiry/feature-flags/releases/tag/v0.0.7))

- The tag v0.0.7 is related to the npm packages (the last commit is related to the feature flags service).
- Creating a Fastify service for the feature flags (/fflags-service).
- Endpoints to create, update, delete and get Flags.
- Endpoint to return the flags using the structure to the app cache them in memory.
- Running MongoDB as a Docker container.
- Using HTTP Client to implement integration tests (HTTP requests).

### Part 7 - Final ([v0.0.8](https://github.com/marcellothiry/feature-flags/releases/tag/v0.0.8))

- Adding new package (loader for REST).
- Consuming the flags service endpoint using the Node.js fetch API.
- Using Vitest mock features to test the loader.
- And this is it for this series.

Thanks for staying with me!

And I see you in the next video!