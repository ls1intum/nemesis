import { MethodLengthBucketDAO } from "@server/domain/dao/methodLengthBucket";
import { SemanticClassTypeCountDAO } from "@server/domain/dao/semanticClassTypeCount";
import { EndpointTypeCountDAO } from "@server/domain/dao/endpointTypeCount";
import { ExternalClassUsageDAO } from "@server/domain/dao/externalClassUsage";
import { ExternalServicesRepositoriesCountDAO } from "@server/domain/dao/externalServicesRepositoriesCount";

export interface IMetricsRepository {
  saveLinesOfCode(
    linesOfCode: number,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void>;
  saveEntityGraphCount(
    entityGraphCount: number,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void>;
  saveEntityCount(
    numberEntity: number,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void>;
  saveNumberEndpoints(
    numberEndpoints: number,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void>;
  saveClassCount(
    numberNonAbstractClasses: number,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void>;
  saveSemanticClassType(
    semanticClassType: SemanticClassTypeCountDAO,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void>;
  saveEndpointTypeCount(
    endpointTypeCount: EndpointTypeCountDAO,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void>;
  saveControllerMethodLengths(
    controllerMethodLengths: MethodLengthBucketDAO[],
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void>;
  saveControllerMethodLengths(
    controllerMethodLengths: MethodLengthBucketDAO[],
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void>;
  saveServiceMethodLengths(
    serviceMethodLengths: MethodLengthBucketDAO[],
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void>;
  saveRepositoryMethodLengths(
    repositoryMethodLengths: MethodLengthBucketDAO[],
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void>;
  saveDistinctExternalClasses(
    externalClassList: ExternalClassUsageDAO,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void>;
  saveExternalServicesRepositoriesCount(
    externalServicesRepositoriesCount: ExternalServicesRepositoriesCountDAO,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void>;

  getLinesOfCode(commitSHA: string, module: string): Promise<number>;
  getEntityGraphCount(commitSHA: string, module: string): Promise<number>;
  getEntityCount(commitSHA: string, module: string): Promise<number>;
  getNumberEndpoints(commitSHA: string, module: string): Promise<number>;
  getClassCount(commitSHA: string, module: string): Promise<number>;
  getSemanticClassType(commitSHA: string, module: string): Promise<SemanticClassTypeCountDAO>;
  getEndpointTypeCount(commitSHA: string, module: string): Promise<EndpointTypeCountDAO>;
  getControllerMethodLengths(commitSHA: string, module: string): Promise<MethodLengthBucketDAO[]>;
  getServiceMethodLengths(commitSHA: string, module: string): Promise<MethodLengthBucketDAO[]>;
  getRepositoryMethodLengths(commitSHA: string, module: string): Promise<MethodLengthBucketDAO[]>;
  getDistinctExternalClasses(commitSHA: string, module: string): Promise<ExternalClassUsageDAO>;
  getExternalServicesRepositoriesCount(
    commitSHA: string,
    module: string,
  ): Promise<ExternalServicesRepositoriesCountDAO>;
}
