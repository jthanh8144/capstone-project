# Safe Talk API

## Deploy

- [Develop](https://safe-talk-dev.jthanh8144.studio/)
<!-- - [Staging](https://safe-talk-staging.jthanh8144.studio/) -->
- [Production](https://safe-talk.jthanh8144.studio/)
<!-- - [Load Balancer](https://safe-talk-alb.jthanh8144.studio/) -->

## Install steps

1. Install dependencies
```
yarn install --frozen-lockfile
```

2. Create `.env` file
```
cp example.env .env
```

3. Fill config for database, mail service, minIO, Redis and Firebase to `.env` file.

4. Build source
```
yarn build
```

5. Run back-end service
```
yarn start
```

## Prepare

- Create a `.env` file from the `.env.example` file

  ```
  cp example.env .env
  ```
  Fill config for database, mail service, minIO, Redis and Firebase.

- Install package

  ```
  npm ci --frozen-lockfile
  ```
  or with yarn
  ```
  yarn install --frozen-lockfile
  ```

- Build source

  ```
  npm run build
  ```
  or with yarn
  ```
  yarn build
  ```

## Local (For DEV)

- Environment

  ```
  node v16+
  ```

- Docker commands

  - Build & run all container

    ```
    docker-compose up --build
    ```

  - Run all container
    ```
    docker-compose up
    ```
  - Run a container
    ```
    docker-compose up <service_name>
    ```
  - Exec

    ```
    docker exec -it <service_name> sh
    ```

## Migration

- Generate migration file with Windows

  ```
  npm run migration:generate-win --name=<file-name>
  ```
  or with Linux / MacOS
  ```
  npm run migration:generate-mac --name=<file-name>
  ```

- Running migration

  ```
  npm run migration:run
  ```
  or with yarn
  ```
  yarn migration:run
  ```

- Revert migration

  ```
  npm run migration:revert
  ```
  or with yarn
  ```
  yarn migration:revert
  ```

# Convention

- [Git Branch Convention](./docs/git-branch-convention.md)
- [Code Convention](./docs/code-convention.md)

# Architect

- [Project Structure](./docs/project-structure.md)
