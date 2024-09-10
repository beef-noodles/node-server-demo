# API

It provides the RESTful API

## Tech Stack

Node, Express, Vite, Prisma, TypeScript, Vitest, pre-commit, Docker

## How to run

Using `docker-compose` to start service and database together, no need to set up the development environment in local

```sh
docker-compose up -d --build
```

## How to develop

Using [`asdf`](https://github.com/asdf-vm/asdf) / [`mise`](https://github.com/jdx/mise) to manage all the runtime and tool version, which is defined in [.tool-versions](.tool-versions)

### Install Dependencies

```sh
asdf install
pnpm install
```

### Start Database

```sh
docker-compose up -d postgis
```

### Start Service

```sh
pnpm run dev
```

### Verify Service

```sh
# Request the Health Check API
curl 'http://localhost:3000/api/v1/health'
# Output should like {"status":"Running","dateTime":"2024-08-13T11:18:11+08:00"}
```

### Database Migration

Using Prisma's `Model/Entity-first migration` pattern to generate / manage migrations like below flow:

![Model/Entity-first migration](https://www.prisma.io/docs/assets/images/entity-first-migration-flow-d2d31eba03a45b765903b594c1843d5a.png)

#### Generate the migration

```sh
# Running below command after you have updated the model definition in ./prisma/schema.prisma
pnpm run db:generate
```

#### Apply the migration

```sh
# Instead of restarting the service, we can deploy the migration manually here
pnpm run db:deploy
```

## Testing

> Note: If you have the issue to run repository tests in you terminal or other place
>
> Please find the command and details according to your container runtime ref to [this article](https://node.testcontainers.org/supported-container-runtimes/#docker)
