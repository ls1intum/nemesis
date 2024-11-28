import type { ExternalClassUsageDAO } from "./externalClassUsage";
import { ExternalServicesRepositoriesCountDAO } from "@server/domain/dao/externalServicesRepositoriesCount";

export type ExternalModuleUsageMetricsDAO = {
  externalClassList: ExternalClassUsageDAO;
  externalServicesRepositoriesCount: ExternalServicesRepositoriesCountDAO;
};
