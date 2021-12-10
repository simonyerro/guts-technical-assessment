# Guts technical assessment

## Description

API used to compute the value of given token using [Nest](https://github.com/nestjs/nest) and [MongoDB](https://github.com/mongodb/mongo)

## Installation

```bash
$ npm install
```

### Environment variables

You'll need to provide some environment variables:
```bash
# .env
COINMARKETCAP_API_KEY='xxx-xxx-xxx-xxx-xxx'
```

## Running the app locally

You'll need to deploy a mongo db locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deploy

```bash
# development
docker compose up dev
```
