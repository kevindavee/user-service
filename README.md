# User Service

An example of a simple user microservice. Following Uncle Bob's clean architecture.

## Getting Started

Quickstart guide for setting up local dev environment.

### System requirements

- Docker

and/or

- Node.js >= 12
- Postgres ~ 10.7

### Setting up your Environment variables using .env file
You can setup your local environment variables using `.env` file

Just run this command and fill the environment variable value inside the `.env` file

```bash
cp .env.example .env
```

### Setting up your local environment using Docker
It is recommended to use Docker to setup the local development

- Start the development cluster

```bash
docker-compose up -d
```

- View consolidated logs via Docker Compose

```bash
docker-compose logs -f
```

- Log into app container

```bash
# the command below will open a shell session inside our app container
docker exec -it user-service sh
# this is for executing CLI in dev env, for i.e. DB migration command like below
npm run migration:run
```

- Shutdown development cluster

```bash
docker-compose down
```

#### Running app server directly on your local machine's environment
If you want to run the web server locally without Docker, make sure you have Node.js 12 installed in your local machine.

You can start a db server using Docker

```bash
docker-compose up -d postgres
```

or using a remote DB and also local machine DB. If you use local machine DB or remote DB, you just need to make sure that you have the [required envs](#setting-up-your-environment-variables-using-.env-file)

Then, start your app server

```bash
npm run start:dev
# you might also want to migrate the DB with this command below
export PGHOST= PGUSER= PGPASSWORD= PGDATABASE=
npm run migration:run
```

If you use Docker to start the DB server, use this command to shut it down

```bash
docker-compose down
```

## Testing

Pre-requisite:

- Node >= 12

### Running unit test

```bash
npm run test
```

with watch mode

```bash
npm run test:watch
```

## Database migration

### On first time setting up the DB

To run migration, first export these environment variables in your terminal session

```bash
npm run migration:run
```

If you want to do the migration outside the Docker environment, you need to set up the required envs before running the migration command

```bash
export PGHOST= PGUSER= PGPASSWORD PGDATABASE= PGPORT=
```

### If you made new changes to the db

Generate migration

```bash
npm run migration:generate -- -n your-migration-file-name
```

### If you made a mistake on running migration

Revert will revert migration file by file

Revert migration

```bash
npm run migration:revert
```
