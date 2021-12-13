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

# Deploy your ingress-controller
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace

# Create secret to pull to my private registry
# Not necessary as I normally put my repository to public
kubectl create secret docker-registry regcred --docker-server=ghcr.io/simonyerro --docker-username=simonyerro --docker-password=$GITHUB_TOKEN

# Create secret to store the coinmarketcap API
# The API will still work without except for /portfolio/value endpoint
kubectl create secret generic coinmarketcap-api-key --from-literal=coinmarketcap_api_key=$COINMARKETCAP_API_KEY

# Update and download the dependencies
# 
helm repo update
helm dependency update ./helm/portfolio_backend
helm dependency build ./helm/portfolio_backend

# Install charts
helm install portfolio ./helm/portfolio_backend

# Since I'm running everything locally, I need to modify manually the /etc/hosts file to add the ingress host
# You need to append the following line to /etc/hosts
127.0.0.1 portfolio.guts
127.0.0.1 grafana.guts

# Get you're grafana ids
echo "User: admin"
echo "Password: $(kubectl get secret portfolio-grafana-admin --namespace default -o jsonpath="{.data.GF_SECURITY_ADMIN_PASSWORD}" | base64 --decode)"
# You can add prometheus as a datasource in http://grafana.guts/datasources/new
# You only need to fill the URL which will be as follow: http://{prometheus_service}.{namespace}.svc.cluster.local:{port}
echo "URL: http://portfolio-kube-prometheus-prometheus.default.svc.cluster.local:9090"

```
