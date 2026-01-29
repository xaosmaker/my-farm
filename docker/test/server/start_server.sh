#!/bin/sh
echo "Running db migrations..."

echo "Removing all db data"
goose -dir sql/test_schemas postgres $DB_URL down
goose -dir sql/schemas postgres $DB_URL down
echo "Recreating db"
goose -dir sql/schemas postgres $DB_URL up
goose -dir sql/test_schemas postgres $DB_URL up
echo "Testing server..."

go test ./... -coverpkg=./... -coverprofile=coverage.out -count=1
echo "Starting server..."
go run .
