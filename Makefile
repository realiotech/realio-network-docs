RELEASE_NAME=realio-network-docs

install:
	helm upgrade --install $(RELEASE_NAME) chart

install-production:
	helm upgrade -n production --install $(RELEASE_NAME) chart -f chart/values-production.yaml

docker-build:
	docker build -t registry.k8s.stage.realio.fund/$(RELEASE_NAME):latest .

docker-push:
	docker push registry.k8s.stage.realio.fund/$(RELEASE_NAME):latest

docker-tag-prod: docker-build
	docker tag registry.k8s.stage.realio.fund/$(RELEASE_NAME):latest registry.k8s.stage.realio.fund/$(RELEASE_NAME):prod

docker-push-prod: docker-tag-prod
	docker push registry.k8s.stage.realio.fund/$(RELEASE_NAME):prod