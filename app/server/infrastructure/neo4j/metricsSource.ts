import { PointInTimeMetricDAO } from "@server/domain/dao/pointInTimeMetric";
import { validateLinesOfCode } from "@server/infrastructure/neo4j/models/linesOfCode.schema";
import { validateClassesCountPerModule } from "@server/infrastructure/neo4j/models/classesCount.schema";
import { validateCodeComplexityMetrics } from "@server/infrastructure/neo4j/models/codeComplexity.schema";
import { validateEndpointTypeCount } from "@server/infrastructure/neo4j/models/endpointTypeCount.schema";
import { validateSemanticClassTypeCount } from "@server/infrastructure/neo4j/models/semanticClassTypeCount.schema";
import { validateExternalClassCount } from "@server/infrastructure/neo4j/models/externalClassCount.schema";
import { validateEntityGraphCountPerModule } from "@server/infrastructure/neo4j/models/entityGraphCount.schema";
import { validateEntityCountPerModule } from "@server/infrastructure/neo4j/models/entityCount.schema";
import { parseMetadata as parseMetadataSchema } from "@server/infrastructure/neo4j/models/metadataSchema";
import { GeneralMetricsDAO } from "@server/domain/dao/generalMetrics";
import { ExternalModuleUsageMetricsDAO } from "@server/domain/dao/externalModuleUsageMetrics";
import { MetadataDAO } from "@server/domain/dao/metadata";
import { ZipClient } from "@server/infrastructure/neo4j/zip";
import { MetricsSourceDAO } from "@server/domain/dao/metricsSource";
import { validateExternalServicesRepositoriesCount } from "@server/infrastructure/neo4j/models/externalServicesRepositoriesCount.schema";

interface RawMetrics {
  metadataRaw: string;
  codeComplexityMetricRaw: string;
  numberOfLinesOfCodeRaw: string;
  restMappingsPerModuleRaw: string;
  semanticClassTypeRaw: string;
  externalSemanticClassesRaw: string;
  entityGraphCountRaw: string;
  entityCountRaw: string;
  classesCountRaw: string;
  externalServicesRepositoriesCountRaw: string;
}

const FILE_METADATA = "metadata.json";
const METHOD_LENGTHS_BY_MODULE = "method-lengths-by-module.json";
const FILE_LINES_OF_CODE = "number-lines-of-code.json";
const FILE_REST_MAPPINGS = "rest-mappings-per-module.json";
const FILE_SEMANTIC_CLASS_TYPE = "semantic-class-type-per-module-count.json";
const FILE_EXTERNAL_SEMANTIC_CLASSES = "external-semantic-classes-used-list.json";
const ENTITY_GRAPH_COUNT = "entity-graphs-per-module-count.json";
const ENTITY_COUNT = "entity-per-module-count.json";
const CLASS_COUNT = "class-per-module-count.json";
const EXTERNAL_SERVICES_REPOSITORIES_COUNT = "external-services-repositories-per-module-count.json";

export const parseMetrics = (zipBuffer: Buffer, zipClient: ZipClient): MetricsSourceDAO => {
  const extractedFiles = extractFiles(zipBuffer, zipClient);
  return {
    metricsByModule: parseModuleMetrics(extractedFiles),
    metadata: parseMetadata(extractedFiles),
  };
};

const extractFiles = (zipBuffer: Buffer, zipClient: ZipClient): RawMetrics => {
  const extractedFiles = zipClient.extractFilesFromZip(zipBuffer, [
    FILE_METADATA,
    METHOD_LENGTHS_BY_MODULE,
    FILE_LINES_OF_CODE,
    FILE_REST_MAPPINGS,
    FILE_SEMANTIC_CLASS_TYPE,
    FILE_EXTERNAL_SEMANTIC_CLASSES,
    ENTITY_GRAPH_COUNT,
    CLASS_COUNT,
    ENTITY_COUNT,
    EXTERNAL_SERVICES_REPOSITORIES_COUNT,
  ]);
  return {
    metadataRaw: extractedFiles[FILE_METADATA],
    codeComplexityMetricRaw: extractedFiles[METHOD_LENGTHS_BY_MODULE],
    numberOfLinesOfCodeRaw: extractedFiles[FILE_LINES_OF_CODE],
    restMappingsPerModuleRaw: extractedFiles[FILE_REST_MAPPINGS],
    semanticClassTypeRaw: extractedFiles[FILE_SEMANTIC_CLASS_TYPE],
    externalSemanticClassesRaw: extractedFiles[FILE_EXTERNAL_SEMANTIC_CLASSES],
    entityGraphCountRaw: extractedFiles[ENTITY_GRAPH_COUNT],
    classesCountRaw: extractedFiles[CLASS_COUNT],
    entityCountRaw: extractedFiles[ENTITY_COUNT],
    externalServicesRepositoriesCountRaw: extractedFiles[EXTERNAL_SERVICES_REPOSITORIES_COUNT],
  };
};

const parseModuleMetrics = (extractedFiles: RawMetrics): Record<string, PointInTimeMetricDAO> => {
  const {
    numberOfLinesOfCodeRaw,
    codeComplexityMetricRaw,
    restMappingsPerModuleRaw,
    semanticClassTypeRaw,
    entityGraphCountRaw,
    entityCountRaw,
    classesCountRaw,
    externalServicesRepositoriesCountRaw,
  } = extractedFiles;

  const linesOfCodePerModule = validateLinesOfCode(numberOfLinesOfCodeRaw);
  const classCountPerModule = validateClassesCountPerModule(classesCountRaw);
  const codeComplexityMetricPerModule = validateCodeComplexityMetrics(codeComplexityMetricRaw);
  const restMappingsPerModule = validateEndpointTypeCount(restMappingsPerModuleRaw);
  const semanticClassTypePerModule = validateSemanticClassTypeCount(semanticClassTypeRaw);
  const externalSemanticClassesPerModule = validateExternalClassCount(
    extractedFiles.externalSemanticClassesRaw,
  );
  const entityGraphCountPerModule = validateEntityGraphCountPerModule(entityGraphCountRaw);
  const entityCountPerModule = validateEntityCountPerModule(entityCountRaw);
  const externalServicesRepositoriesCount = validateExternalServicesRepositoriesCount(
    externalServicesRepositoriesCountRaw,
  );

  const moduleNames = Object.keys(linesOfCodePerModule);
  const result: Record<string, PointInTimeMetricDAO> = {};

  for (const moduleName of moduleNames) {
    const restMappings = restMappingsPerModule[moduleName];
    const semanticClassType = semanticClassTypePerModule[moduleName];
    const externalSemanticClasses = externalSemanticClassesPerModule[moduleName];

    const generalMetrics: GeneralMetricsDAO = {
      classCount: classCountPerModule[moduleName],
      linesOfCode: linesOfCodePerModule[moduleName],
      numberEndpoints: Object.values(restMappings).reduce((acc, curr) => acc + curr, 0),
      semanticClassType: semanticClassType,
      endpointTypeCount: restMappings,
      numberEntityGraphs: entityGraphCountPerModule[moduleName],
      numberEntity: entityCountPerModule[moduleName],
    };
    const codeComplexityMetrics = codeComplexityMetricPerModule[moduleName];
    const externalModuleUsageMetrics: ExternalModuleUsageMetricsDAO = {
      externalClassList: externalSemanticClasses,
      externalServicesRepositoriesCount: externalServicesRepositoriesCount[moduleName],
    };

    result[moduleName] = {
      generalMetrics,
      codeComplexityMetrics,
      externalModuleUsageMetrics,
    };
  }

  return result;
};

const parseMetadata = (extractedFiles: RawMetrics): MetadataDAO => {
  const { metadataRaw } = extractedFiles;
  return parseMetadataSchema(metadataRaw);
};
