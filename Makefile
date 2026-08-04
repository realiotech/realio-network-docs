RELEASE_NAME=realio-network-docs
REGISTRY=registry.digitalocean.com/kubernetes-prod

docker-build:
	docker build -t $(REGISTRY)/$(RELEASE_NAME):latest .

docker-push:
	docker push $(REGISTRY)/$(RELEASE_NAME):latest
