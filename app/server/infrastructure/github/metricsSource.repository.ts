import { GithubClient } from "@server/infrastructure/github/githubClient";
import { ZipClient } from "@server/infrastructure/neo4j/zip";
import { IMetricsSourceRepository } from "@server/domain/repository/metricsSource.repository";
import { MetricsSourceDAO } from "@server/domain/dao/metricsSource";
import { parseMetrics } from "@server/infrastructure/neo4j/metricsSource";

export class metricsSourceRepositoryImpl implements IMetricsSourceRepository {
  constructor(
    private readonly githubClient: GithubClient,
    private readonly zipClient: ZipClient,
  ) {}

  public getMetrics = async (artifactID: string): Promise<MetricsSourceDAO> => {
    const zipBuffer = await this.githubClient.downloadArtifact(artifactID);
    return parseMetrics(zipBuffer, this.zipClient);
  };
}
