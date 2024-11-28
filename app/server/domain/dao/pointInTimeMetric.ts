import type { CodeComplexityMetricsDAO } from "./codeComplexityMetrics";
import type { ExternalModuleUsageMetricsDAO } from "./externalModuleUsageMetrics";
import type { GeneralMetricsDAO } from "./generalMetrics";

export type PointInTimeMetricDAO = {
  generalMetrics: GeneralMetricsDAO;
  codeComplexityMetrics: CodeComplexityMetricsDAO;
  externalModuleUsageMetrics: ExternalModuleUsageMetricsDAO;
};
