#!/bin/bash

set -e pipefail

QUERIES_DIR="queries"
OUTPUTS_DIR="output"

mkdir -p $OUTPUTS_DIR

for file in "$QUERIES_DIR"/*.cql; do
  filename=$(basename "$file" .cql)

  # Replace newlines and double quotes
  query=$(tr '\n' ' ' < "$file" | sed "s/\"/'/g")
  echo "Executing query in $file"
  response=$(curl -X POST http://localhost:7474/db/neo4j/tx \
    -H "Content-Type: application/json" \
    -u "neo4j:password" \
    -d "{\"statements\": [{\"statement\": \"$query\"}]}")

    formatted_response=$(echo "$response" | jq '.')
    echo "$formatted_response" > "${OUTPUTS_DIR}/${filename}.json"

    error_count=$(echo "$formatted_response" | jq '.errors | length')
    if [[ "$error_count" -ne 0 ]]; then
      echo "Error: Query in $file resulted in errors. Check ${OUTPUTS_DIR}/${filename}.json for details."
      echo "$formatted_response" > "${OUTPUTS_DIR}/${filename}.json"
      exit 1
    fi
done
