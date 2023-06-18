# Feature Flags Service

## Installation

### MongoDB as a Docker Container

If you have MongoDB already installed you can just check the script `init-db.sh` content and run the commands there.
In case you don't, you can use Docker (check the compose file in `./mongodb`) to run MongoDB as a container.
If you want to know more about running MongoDB in Docker, you can check this video:
[How to run MongoDB in Docker: dev setups](https://www.youtube.com/watch?v=cfmPk93mOeo) (channel
[@fromDev2Dev](https://www.youtube.com/@fromDev2Dev)).

Open Git Bash in this project folder and run the following commands:

```
cd mongodb
docker compose up -d
```

When the container has been started up, run the script:

```
./init-db.sh
```

This will create the `fflags-user` for the `fflags` database.

### Running and Building the Service

You don't need to build first to run the project. Just run the script dev (it's using tsx):

```
npm run dev
```

If you want to build (output folder is ./dist) and run in an environment, use the scripts build and start:

```
npm run build
npm run start
```