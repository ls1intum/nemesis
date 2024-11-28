import { MethodLengthBucketDAO } from "./methodLengthBucket";

export type CodeComplexityMetricsDAO = {
  controllerMethodLengths: Array<MethodLengthBucketDAO>;
  serviceMethodLengths: Array<MethodLengthBucketDAO>;
  repositoryMethodLengths: Array<MethodLengthBucketDAO>;
};
