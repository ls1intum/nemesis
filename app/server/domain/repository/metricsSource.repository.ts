import { MetricsSourceDAO } from "@server/domain/dao/metricsSource";

export interface IMetricsSourceRepository {
  getMetrics(artifactID: string): Promise<MetricsSourceDAO>;
}
