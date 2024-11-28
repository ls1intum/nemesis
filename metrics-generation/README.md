# Metrics Generation

This folder serves two purposes. First, it contains configuration to generate metrics. Secondly, it is used by [a pipeline](../.github/workflows/metrics-generation.yml) to run the SCA tool jqassistant

## Structure

This folder contains the following files and folders:

- queries: Contains the queries that are used to generate the metrics.
- .jqassistant: Contains the configuration for the jQAssistant tool.
- docker-compose.yaml: Docker compose file to start the Neo4j database
- query-neo4j.sh: Script to execute the queries against the Neo4j database.

## How to run locally

1. Install the jqassistant command line tool. See [here](https://jqassistant.github.io/jqassistant/current/#_command_line) for instructions. Extract the zip file to this folder.
2. Copy an `Artemis.jar` file to this folder. You can generate this jar by running `./gradlew build -x webapp -x test` in the [Artemis project](https://github.com/ls1intum/Artemis) and copying the generating jar from `build/libs/Artemis-<version>.jar`.
3. Run the following command to scan the Artemis.jar file with jqassistant:

```bash
./jqassistant-commandline-neo4jv5-2.5.0/bin/jqassistant.sh scan
```

4. Start the Neo4j database with the following command:

```bash
docker-compose up -d
```

5. Run the following command to execute the queries against the Neo4j database:

```bash
./query-neo4j.sh
```

6. The results are stored in the `output` folder.

## Add new queries

To add new queries, create a new file in the `queries` folder with the ending `.cql`.

**Important**: Make sure this file does not contain any comments (`//`). Newlines and single/double quotes are supported.
