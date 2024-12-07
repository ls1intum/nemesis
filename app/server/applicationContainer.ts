"use cache";

import { metadataRepositoryImpl } from "@server/infrastructure/influx/metadata.repository";
import { IMetadataService, metadataServiceImpl } from "@server/domain/services/metadata.service";
import { IMetricsService, metricsServiceImpl } from "@server/domain/services/metrics.service";
import { metricsRepositoryImpl } from "@server/infrastructure/influx/metrics.repository";
import { InfluxClient } from "@server/infrastructure/influx/influx";
import process from "node:process";
import { GithubClient } from "@server/infrastructure/github/githubClient";
import { metricsSourceRepositoryImpl } from "@server/infrastructure/github/metricsSource.repository";
import { ZipClient } from "@server/infrastructure/neo4j/zip";
import { IMetricsSourceRepository } from "@server/domain/repository/metricsSource.repository";
import { IMetricsRepository } from "@server/domain/repository/metrics.repository";
import { IMetadataRepository } from "@server/domain/repository/metada.repository";

/**
 * Stores all the injected (singleton) dependencies of the application.
 */
interface ApplicationContainer {
  getMetricsSourceRepository: () => IMetricsSourceRepository;
  getMetadataService: () => IMetadataService;
  getMetricsService: () => IMetricsService;
  getZipClient: () => ZipClient;
}

// Infrastructure Factory Functions
let influxClient: InfluxClient | undefined;
const createInfluxClient = (): InfluxClient => {
  if (influxClient) {
    return influxClient;
  }
  const url = process.env.INFLUXDB_URL || "";
  const token = process.env.INFLUXDB_TOKEN || "";
  const org = process.env.INFLUXDB_ORG || "";
  const bucket = process.env.INFLUXDB_BUCKET || "";

  influxClient = new InfluxClient(url, token, org, bucket);
  return influxClient;
};

let githubClient: GithubClient | undefined;
const createGithubClient = (): GithubClient => {
  if (githubClient) {
    return githubClient;
  }
  const OWNER = process.env.REPOSITORY_OWNER || "";
  const REPO = process.env.REPOSITORY_NAME || "";
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
  githubClient = new GithubClient(OWNER, REPO, GITHUB_TOKEN);
  return githubClient;
};

let zipClient: ZipClient | undefined;
const createZipClient = (): ZipClient => {
  if (zipClient) {
    return zipClient;
  }
  zipClient = new ZipClient();
  return zipClient;
};

// Repository Factory Functions
let metadataRepository: IMetadataRepository | undefined;
const createMetadataRepository = (): IMetadataRepository => {
  if (metadataRepository) {
    return metadataRepository;
  }
  const influxClient = createInfluxClient();
  metadataRepository = new metadataRepositoryImpl(influxClient);
  return metadataRepository;
};

let metricsRepository: IMetricsRepository | undefined;
const createMetricsRepository = (): IMetricsRepository => {
  if (metricsRepository) {
    return metricsRepository;
  }
  const influxClient = createInfluxClient();
  metricsRepository = new metricsRepositoryImpl(influxClient);
  return metricsRepository;
};

let metricsSourceRepository: IMetricsSourceRepository | undefined;
const createMetricsSourceRepository = (): IMetricsSourceRepository => {
  if (metricsSourceRepository) {
    return metricsSourceRepository;
  }
  const githubClient = createGithubClient();
  const zipClient = createZipClient();
  metricsSourceRepository = new metricsSourceRepositoryImpl(githubClient, zipClient);
  return metricsSourceRepository;
};

// Service Factory Functions
let metadataService: IMetadataService | undefined;
const createMetadataService = (): IMetadataService => {
  if (metadataService) {
    return metadataService;
  }
  const metadataRepository = createMetadataRepository();
  metadataService = new metadataServiceImpl(metadataRepository);
  return metadataService;
};

let metricsService: IMetricsService | undefined;
const createMetricsService = (): IMetricsService => {
  if (metricsService) {
    return metricsService;
  }
  const metricsRepository = createMetricsRepository();
  metricsService = new metricsServiceImpl(metricsRepository);
  return metricsService;
};

const applicationContainer: ApplicationContainer = {
  getMetricsSourceRepository: () => createMetricsSourceRepository(),
  getMetadataService: () => createMetadataService(),
  getMetricsService: () => createMetricsService(),
  getZipClient: () => createZipClient(),
};

export default applicationContainer;
