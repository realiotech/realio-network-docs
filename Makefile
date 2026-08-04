RELEASE_NAME=realio-network-docs
REGISTRY=registry.digitalocean.com/kubernetes-prod

# Local image build only. CI (.github/workflows/prod.yaml) builds the tag that
# actually ships and pins it in the gitops repo for ArgoCD to sync.
docker-build:
	docker build -t $(REGISTRY)/$(RELEASE_NAME):latest .

docker-push:
	docker push $(REGISTRY)/$(RELEASE_NAME):latest
