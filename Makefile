# salon-app/Makefile

.PHONY: gen-api

gen-api:
	@echo "--- Generating Swagger 2.0 from Go code ---"
	# --dir cmd と指定することで、swagに cmd フォルダ内を強制的に見に行かせます
	# その際、-g はそのフォルダ内にある main.go を指すようにします
	cd backend && CGO_ENABLED=0 swag init -g main.go --dir cmd --output docs --outputTypes "json,yaml"

	@echo "--- Converting Swagger 2.0 to OpenAPI 3.0 ---"
	cd backend && npx swagger2openapi docs/swagger.yaml -o docs/openapi.yaml --yaml

	@echo "--- Generating TypeScript types from OpenAPI 3.0 ---"
	mkdir -p frontend/src/api
	cd frontend && npx openapi-typescript ../backend/docs/openapi.yaml -o src/api/api.d.ts