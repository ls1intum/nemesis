# Artemis Module Metrics

This project contains configuration to generate metrics for the server code of [Artemis project](https://github.com/ls1intum/Artemis). In addition, it contains a NextJS application to visualize the metrics by reading/writing to an InfluxDB.

## Structure

This project contains the following (relevant) folders:

- app: Contains the NextJS application to store and visualize the metrics.
- metrics-generation: Contains the configuration to generate metrics on the Artemis project.

## How to run locally

For the metrics generation, refer to the [README](metrics-generation/README.md) in the `metrics-generation` folder.

For the app, run `docker-compose up` in the root folder. The app will be available at `http://localhost:3000`. This docker setup is intended to also be used in development while supporting hot-reloading. The production application is built using a different `target` (for dev: `artemis-module-metrics-dev` as set in the [docker-compose.yaml](docker-compose.yaml)).

## Backend Endpoints

The app exposes two public endpoints:
- POST `/api/trigger-metrics-scrape`: Given a artifactId, downloads the GitHub artifact from this repository. You need to store a `GITHUB_TOKEN` in a `.env`-file
- POST `/api/uploadmetrics`: Given a zip file, uploads the metrics to the InfluxDB. You need to set `METRICS_UPLOAD_ENABLED=true` in a `.env`-file
