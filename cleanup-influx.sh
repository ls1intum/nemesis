#!/bin/bash
INFLUX_URL="http://localhost:8086"
ORG="artemis-module-metrics"
BUCKET="metrics"
INFLUX_TOKEN="AzOkv9O3yPxka4EcSn6GNkh_UQUhB6La8chV6iOpmbVpI_c2Kqh4CVkXPkBoWm6q_a5dsuphZ7KrZdT92DRIAg=="

curl -X POST "$INFLUX_URL/api/v2/delete?org=$ORG&bucket=$BUCKET" \
  -H "Authorization: Token $INFLUX_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "start": "1970-01-01T00:00:00Z",
    "stop": "2262-04-11T23:47:16.854775806Z"
  }'

