#!/bin/bash

set -e pipefail

OUTPUTS_DIR="output"

COMMIT_HASH=$(git -C Artemis rev-parse HEAD)
COMMIT_DATE=$(git -C Artemis show -s --format=%ci "$COMMIT_HASH")

jq -n --arg commit_hash "$COMMIT_HASH" --arg commit_date "$COMMIT_DATE" '{commitSHA: $commit_hash, commitDate: $commit_date}' > "$OUTPUTS_DIR/metadata.json"