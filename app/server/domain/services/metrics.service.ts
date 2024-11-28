import type { IMetricsRepository } from "@server/domain/repository/metrics.repository";
import { PointInTimeMetricDAO } from "@server/domain/dao/pointInTimeMetric";
import { GeneralMetricsDAO } from "@server/domain/dao/generalMetrics";
import { ExternalModuleUsageMetricsDAO } from "@server/domain/dao/externalModuleUsageMetrics";
import { CodeComplexityMetricsDAO } from "@server/domain/dao/codeComplexityMetrics";

export interface IMetricsService {
  saveMetrics(
    metricsByModule: Record<string, PointInTimeMetricDAO>,
    commitSHA: string,
    commitDate: Date,
  ): Promise<void>;
  getGeneralMetrics(commitSHA: string, module: string): Promise<GeneralMetricsDAO>;
  getCodeComplexityMetrics(commitSHA: string, module: string): Promise<CodeComplexityMetricsDAO>;
  getExternalModuleUsageMetrics(
    commitSHA: string,
    module: string,
  ): Promise<ExternalModuleUsageMetricsDAO>;
}

export class metricsServiceImpl implements IMetricsService {
  private metricsRepository: IMetricsRepository;

  constructor(metricsRepository: IMetricsRepository) {
    this.metricsRepository = metricsRepository;
  }

  async saveMetrics(
    metrics: Record<string, PointInTimeMetricDAO>,
    commitSHA: string,
    commitDate: Date,
  ) {
    for (const [module, moduleMetrics] of Object.entries(metrics)) {
      await this.saveModuleMetric(moduleMetrics, commitSHA, commitDate, module);
    }
  }

  async saveModuleMetric(
    metrics: PointInTimeMetricDAO,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ) {
    const { generalMetrics, codeComplexityMetrics, externalModuleUsageMetrics } = metrics;

    const { linesOfCode, classCount, numberEndpoints, numberEntityGraphs, numberEntity } =
      generalMetrics;
    await this.metricsRepository.saveLinesOfCode(linesOfCode, commitSHA, commitDate, module);
    await this.metricsRepository.saveEntityGraphCount(
      numberEntityGraphs,
      commitSHA,
      commitDate,
      module,
    );
    await this.metricsRepository.saveEntityCount(numberEntity, commitSHA, commitDate, module);
    await this.metricsRepository.saveNumberEndpoints(
      numberEndpoints,
      commitSHA,
      commitDate,
      module,
    );
    await this.metricsRepository.saveClassCount(classCount, commitSHA, commitDate, module);
    await this.metricsRepository.saveSemanticClassType(
      generalMetrics.semanticClassType,
      commitSHA,
      commitDate,
      module,
    );
    await this.metricsRepository.saveEndpointTypeCount(
      generalMetrics.endpointTypeCount,
      commitSHA,
      commitDate,
      module,
    );

    const { controllerMethodLengths, serviceMethodLengths, repositoryMethodLengths } =
      codeComplexityMetrics;
    await this.metricsRepository.saveControllerMethodLengths(
      controllerMethodLengths,
      commitSHA,
      commitDate,
      module,
    );
    await this.metricsRepository.saveServiceMethodLengths(
      serviceMethodLengths,
      commitSHA,
      commitDate,
      module,
    );
    await this.metricsRepository.saveRepositoryMethodLengths(
      repositoryMethodLengths,
      commitSHA,
      commitDate,
      module,
    );

    const { externalClassList, externalServicesRepositoriesCount } = externalModuleUsageMetrics;
    await this.metricsRepository.saveDistinctExternalClasses(
      externalClassList,
      commitSHA,
      commitDate,
      module,
    );
    await this.metricsRepository.saveExternalServicesRepositoriesCount(
      externalServicesRepositoriesCount,
      commitSHA,
      commitDate,
      module,
    );
  }

  async getGeneralMetrics(commitSHA: string, module: string): Promise<GeneralMetricsDAO> {
    const linesOfCode = await this.metricsRepository.getLinesOfCode(commitSHA, module);
    const numberEndpoints = await this.metricsRepository.getNumberEndpoints(commitSHA, module);
    const classCount = await this.metricsRepository.getClassCount(commitSHA, module);
    const semanticClassType = await this.metricsRepository.getSemanticClassType(commitSHA, module);
    const endpointTypeCount = await this.metricsRepository.getEndpointTypeCount(commitSHA, module);
    const numberEntityGraphs = await this.metricsRepository.getEntityGraphCount(commitSHA, module);
    const numberEntity = await this.metricsRepository.getEntityCount(commitSHA, module);

    return {
      linesOfCode,
      numberEndpoints,
      classCount,
      semanticClassType,
      endpointTypeCount,
      numberEntityGraphs,
      numberEntity,
    };
  }

  async getExternalModuleUsageMetrics(
    commitSHA: string,
    module: string,
  ): Promise<ExternalModuleUsageMetricsDAO> {
    const distinctExternalClasses = await this.metricsRepository.getDistinctExternalClasses(
      commitSHA,
      module,
    );
    const externalServicesRepositoriesCount =
      await this.metricsRepository.getExternalServicesRepositoriesCount(commitSHA, module);
    return {
      externalClassList: distinctExternalClasses,
      externalServicesRepositoriesCount,
    };
  }

  async getCodeComplexityMetrics(
    commitSHA: string,
    module: string,
  ): Promise<CodeComplexityMetricsDAO> {
    const controllerMethodLengths = await this.metricsRepository.getControllerMethodLengths(
      commitSHA,
      module,
    );
    const serviceMethodLengths = await this.metricsRepository.getServiceMethodLengths(
      commitSHA,
      module,
    );
    const repositoryMethodLengths = await this.metricsRepository.getRepositoryMethodLengths(
      commitSHA,
      module,
    );
    return {
      controllerMethodLengths,
      serviceMethodLengths,
      repositoryMethodLengths,
    };
  }
}
