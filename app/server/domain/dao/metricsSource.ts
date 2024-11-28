import { MetadataDAO } from "@server/domain/dao/metadata";
import { PointInTimeMetricDAO } from "@server/domain/dao/pointInTimeMetric";

export interface MetricsSourceDAO {
  metadata: MetadataDAO;
  metricsByModule: Record<string, PointInTimeMetricDAO>;
}
