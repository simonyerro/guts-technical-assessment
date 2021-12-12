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

### Docker compose
```bash
# development
docker compose up dev
```

### Helm

```bash
# Add the repo containing the Mongodb chart
helm repo add bitnami https://charts.bitnami.com/bitnami

# Create secret to pull to my private registry
kubectl create secret docker-registry regcred --docker-server=ghcr.io/simonyerro --docker-username=simonyerro --docker-password=$GITHUB_TOKEN

# If using minikube, you need to run commands to enable ingress
minikube addons enable ingress
minikube addons enable ingress-dns

# Install charts
helm install mongodb bitnami/mongodb -f helm/mongodb/values.yaml
helm install portfolio ./helm/portfolio_backend

```
