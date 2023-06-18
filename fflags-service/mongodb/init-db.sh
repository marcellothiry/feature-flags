#!/bin/bash

docker exec -it mongodb mongosh --quiet \
  --eval 'use admin' \
  --eval 'db.auth({ user: "root", pwd: "1234" })' \
  --eval 'use fflags' \
  --eval 'db.createUser({ user: "fflags-user", pwd: "1234", roles: [{ role: "readWrite", db: "fflags" }] })' \
  --eval 'show users'
