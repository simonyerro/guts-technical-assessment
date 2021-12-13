# Guts technical assessment

## Description

API used to compute the value of given token using [Nest](https://github.com/nestjs/nest) and [MongoDB](https://github.com/mongodb/mongo)

## Installation

```bash
npm install
```

### Environment variables

You'll need to provide some environment variables:

```bash
# .env
# Everything will work without COINMARKETCAP_API_KEY except the portfolio/value endpoint in the API
COINMARKETCAP_API_KEY='xxx-xxx-xxx-xxx-xxx'
$GITHUB_TOKEN='xxxxxxx'
```

## Deploy

### Helm

```bash
# Add the repo containing the Mongodb chart
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add grafana https://grafana.github.io/helm-charts

# Deploy your ingress-controller
# I chose to not put it in the helm chart since it is supposed to be common to all of the cluster. 
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
helm repo update
helm dependency update ./helm/portfolio_backend
helm dependency build ./helm/portfolio_backend

# Install charts
helm install portfolio ./helm/portfolio_backend --render-subchart-notes

# Since I'm running everything locally, I need to modify manually the /etc/hosts file to add the ingress host
# You need to append the following line to /etc/hosts
127.0.0.1 portfolio.guts
127.0.0.1 grafana.guts
```

## Use the API

You can access the API at: <http://portfolio.guts/>, you'll be redirected to the documentation.

A way to use the API could be:

```bash
# Create a new portfolio
curl -X POST -H "Content-Type: application/json" -d @files/example_portfolio.json http://portfolio.guts/portfolio/create
# Retrieve your portfolio with the _id returned by the previous endpoint
curl get http://portfolio.guts/portfolio/portfolio/{_id}
# Or get all portfolios
curl get http://portfolio.guts/portfolio/portfolios
# Compute value of your portfolio
curl "http://portfolio.guts/portfolio/value/{_id}?currency=EUR"
# Delete your portfolio
curl -X DELETE "http://portfolio.guts/portfolio/delete?portfolioID={_id}"
```

## Grafana

```bash
# Get you're grafana IDs
echo "User: admin"
echo "Password: $(kubectl get secret portfolio-grafana-admin --namespace default -o jsonpath="{.data.GF_SECURITY_ADMIN_PASSWORD}" | base64 --decode)"
```

You can access the Grafana at: <http://grafana.guts/>

You can add prometheus and loki as a datasource in <http://grafana.guts/datasources/new>

You only need to fill the URL which will be as follow: http://{service}.{namespace}.svc.cluster.local:{port}
so: 
* <http://portfolio-kube-prometheus-prometheus.default.svc.cluster.local:9090> for prometheus
* <http://portfolio-loki.default.svc.cluster.local:3100>

## Upgrade

### App

When you have applied changes to your application, you need to build your image and push it to registry. I chose to use the github registry linked to my repository.

You can either do it manually with:

```bash
docker build . -t ghcr.io/simonyerro/crypto_backend:x.y.z
docker push ghcr.io/simonyerro/crypto_backend:x.y.z
```

or simply push your changes, the CI will do the same job tagging with the sha1 of the commit

You can finally upgrade the helm chart to pull the new image

### Helm

```bash
# To upgrade your helm chart, you need to provide the root password of mongodb, you can get it using
 export MONGODB_ROOT_PASSWORD=$(kubectl get secret --namespace default portfolio-mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 --decode)
 # And then, upgrade your helm release, using:
helm upgrade portfolio helm/portfolio_backend --set mongodb.auth.rootPassword=$MONGODB_ROOT_PASSWORD
```
