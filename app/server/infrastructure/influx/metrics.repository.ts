import { Point } from "@influxdata/influxdb-client";
import { InfluxClient, InfluxMetricsPoint } from "@server/infrastructure/influx/influx";
import { IMetricsRepository } from "@server/domain/repository/metrics.repository";
import { MethodLengthBucketDAO } from "@server/domain/dao/methodLengthBucket";
import { ExternalClassUsageDAO } from "@server/domain/dao/externalClassUsage";
import { EndpointTypeCountDAO } from "@server/domain/dao/endpointTypeCount";
import { SemanticClassTypeCountDAO } from "@server/domain/dao/semanticClassTypeCount";
import { validateNumberEndpointsSchema } from "@server/infrastructure/influx/models/numberEndpoints.schema";
import { validateSemanticClassTypeSchema } from "@server/infrastructure/influx/models/semanticClassTypeCount.schema";
import { validateMethodLengthBucketsSchema } from "@server/infrastructure/influx/models/methodLengthBuckets.schema";
import { validateEndpointTypeCountSchema } from "@server/infrastructure/influx/models/endpointTypeCount.schema";
import { validateExternalClassUsageSchema } from "@server/infrastructure/influx/models/externalClasses.schema";
import { validateLinesOfCodeSchema } from "@server/infrastructure/influx/models/linesOfCode.schema";
import { validateEntityGraphCountSchema } from "@server/infrastructure/influx/models/entityGraphCount.schema";
import { validateClassCountSchema } from "@server/infrastructure/influx/models/classCount.schema";
import { validateEntityCountSchema } from "@server/infrastructure/influx/models/entityCount.schema";
import { ExternalServicesRepositoriesCountDAO } from "@server/domain/dao/externalServicesRepositoriesCount";
import { validateExternalServicesRepositoriesCountSchema } from "@server/infrastructure/influx/models/externalServicesRepositoriesCount.schema";

export class metricsRepositoryImpl implements IMetricsRepository {
  constructor(private readonly influxClient: InfluxClient) {}

  async saveLinesOfCode(
    linesOfCode: number,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void> {
    const points: InfluxMetricsPoint[] = [
      {
        measurement: "lines_of_code",
        fields: { value: linesOfCode },
      },
    ];

    await this.writePointsToInflux(points, commitSHA, commitDate, module);
  }

  async saveEntityGraphCount(
    entityGraphCount: number,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void> {
    const points: InfluxMetricsPoint[] = [
      {
        measurement: "entity_graph_count",
        fields: { value: entityGraphCount },
      },
    ];

    await this.writePointsToInflux(points, commitSHA, commitDate, module);
  }

  async saveEntityCount(
    numberEntity: number,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void> {
    const points: InfluxMetricsPoint[] = [
      {
        measurement: "entity_count",
        fields: { value: numberEntity },
      },
    ];

    await this.writePointsToInflux(points, commitSHA, commitDate, module);
  }

  async saveNumberEndpoints(
    numberEndpoints: number,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void> {
    const points: InfluxMetricsPoint[] = [
      {
        measurement: "number_endpoints",
        fields: { value: numberEndpoints },
      },
    ];

    await this.writePointsToInflux(points, commitSHA, commitDate, module);
  }

  async saveClassCount(
    classCount: number,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void> {
    const points: InfluxMetricsPoint[] = [
      {
        measurement: "class_count",
        fields: { value: classCount },
      },
    ];

    await this.writePointsToInflux(points, commitSHA, commitDate, module);
  }

  async saveSemanticClassType(
    semanticClassType: SemanticClassTypeCountDAO,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void> {
    const points: InfluxMetricsPoint[] = [];

    for (const [type, count] of Object.entries(semanticClassType)) {
      points.push({
        measurement: "semantic_class_type",
        tags: { type },
        fields: { count },
      });
    }

    await this.writePointsToInflux(points, commitSHA, commitDate, module);
  }

  async saveEndpointTypeCount(
    endpointTypeCount: EndpointTypeCountDAO,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void> {
    const points: InfluxMetricsPoint[] = [];

    for (const [method, count] of Object.entries(endpointTypeCount)) {
      points.push({
        measurement: "endpoint_type_count",
        tags: { method },
        fields: { count },
      });
    }

    await this.writePointsToInflux(points, commitSHA, commitDate, module);
  }

  async saveControllerMethodLengths(
    controllerMethodLengths: MethodLengthBucketDAO[],
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void> {
    const points: InfluxMetricsPoint[] = [];

    for (const bucket of controllerMethodLengths) {
      points.push({
        measurement: "controller_method_lengths",
        tags: {
          loc_start_inclusive: bucket.locStartInclusive,
          loc_end_inclusive: bucket.locEndInclusive,
        },
        fields: {
          count: bucket.count,
        },
      });
    }

    await this.writePointsToInflux(points, commitSHA, commitDate, module);
  }

  async saveServiceMethodLengths(
    serviceMethodLengths: MethodLengthBucketDAO[],
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void> {
    const points: InfluxMetricsPoint[] = [];

    for (const bucket of serviceMethodLengths) {
      points.push({
        measurement: "service_method_length",
        tags: {
          loc_start_inclusive: bucket.locStartInclusive,
          loc_end_inclusive: bucket.locEndInclusive,
        },
        fields: {
          count: bucket.count,
        },
      });
    }

    await this.writePointsToInflux(points, commitSHA, commitDate, module);
  }

  async saveRepositoryMethodLengths(
    repositoryMethodLengths: MethodLengthBucketDAO[],
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void> {
    const points: InfluxMetricsPoint[] = [];

    for (const bucket of repositoryMethodLengths) {
      points.push({
        measurement: "repository_method_length",
        tags: {
          loc_start_inclusive: bucket.locStartInclusive,
          loc_end_inclusive: bucket.locEndInclusive,
        },
        fields: {
          count: bucket.count,
        },
      });
    }

    await this.writePointsToInflux(points, commitSHA, commitDate, module);
  }

  async saveDistinctExternalClasses(
    externalClassList: ExternalClassUsageDAO,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void> {
    const points: InfluxMetricsPoint[] = [];
    if (!externalClassList) {
      return;
    }
    Object.entries(externalClassList).forEach(([type, classes]) => {
      points.push({
        measurement: "external_class_usage",
        tags: {
          module,
          semantic_class_type: type,
        },
        fields: {
          count: classes.join(","),
        },
      });
    });

    await this.writePointsToInflux(points, commitSHA, commitDate, module);
  }

  async saveExternalServicesRepositoriesCount(
    externalServicesRepositoriesCount: ExternalServicesRepositoriesCountDAO,
    commitSHA: string,
    commitDate: Date,
    module: string,
  ): Promise<void> {
    const points: InfluxMetricsPoint[] = [];

    for (const { externalClass, externalModule, count } of externalServicesRepositoriesCount) {
      points.push({
        measurement: "external_services_repositories_count",
        tags: {
          externalModule,
          externalClass,
        },
        fields: {
          count,
        },
      });
    }

    await this.writePointsToInflux(points, commitSHA, commitDate, module);
  }

  async getControllerMethodLengths(
    commitSHA: string,
    module: string,
  ): Promise<MethodLengthBucketDAO[]> {
    const query = `
    from(bucket: "${this.influxClient.bucket}")
        |> range(start: 0)
        |> filter(fn: (r) => r.commit_sha == "${commitSHA}")
        |> filter(fn: (r) => r.module == "${module}")
        |> filter(fn: (r) => r._measurement == "controller_method_lengths")
    `;
    const rows = await this.influxClient.collectRows(query);
    return validateMethodLengthBucketsSchema(rows);
  }

  async getDistinctExternalClasses(
    commitSHA: string,
    module: string,
  ): Promise<ExternalClassUsageDAO> {
    const query = `
    from(bucket: "${this.influxClient.bucket}")
        |> range(start: 0)
        |> filter(fn: (r) => r.commit_sha == "${commitSHA}")
        |> filter(fn: (r) => r.module == "${module}")
        |> filter(fn: (r) => r._measurement == "external_class_usage")
    `;
    const rows = await this.influxClient.collectRows(query);
    return validateExternalClassUsageSchema(rows);
  }

  async getEndpointTypeCount(commitSHA: string, module: string): Promise<EndpointTypeCountDAO> {
    const query = `
    from(bucket: "${this.influxClient.bucket}")
        |> range(start: 0)
        |> filter(fn: (r) => r.commit_sha == "${commitSHA}")
        |> filter(fn: (r) => r.module == "${module}")
        |> filter(fn: (r) => r._measurement == "endpoint_type_count")
    `;
    const rows = await this.influxClient.collectRows(query);
    return validateEndpointTypeCountSchema(rows);
  }

  async getLinesOfCode(commitSHA: string, module: string): Promise<number> {
    const query = `
    from(bucket: "${this.influxClient.bucket}")
        |> range(start: 0)
        |> filter(fn: (r) => r.commit_sha == "${commitSHA}")
        |> filter(fn: (r) => r.module == "${module}")
        |> filter(fn: (r) => r._measurement == "lines_of_code")
    `;
    const rows = await this.influxClient.collectRows(query);
    return validateLinesOfCodeSchema(rows);
  }

  async getEntityGraphCount(commitSHA: string, module: string): Promise<number> {
    const query = `
    from(bucket: "${this.influxClient.bucket}")
        |> range(start: 0)
        |> filter(fn: (r) => r.commit_sha == "${commitSHA}")
        |> filter(fn: (r) => r.module == "${module}")
        |> filter(fn: (r) => r._measurement == "entity_graph_count")
    `;
    const rows = await this.influxClient.collectRows(query);
    return validateEntityGraphCountSchema(rows);
  }

  async getEntityCount(commitSHA: string, module: string): Promise<number> {
    const query = `
    from(bucket: "${this.influxClient.bucket}")
        |> range(start: 0)
        |> filter(fn: (r) => r.commit_sha == "${commitSHA}")
        |> filter(fn: (r) => r.module == "${module}")
        |> filter(fn: (r) => r._measurement == "entity_count")
    `;

    const rows = await this.influxClient.collectRows(query);
    if (!rows.length) {
      return 0;
    }
    return validateEntityCountSchema(rows);
  }

  async getNumberEndpoints(commitSHA: string, module: string): Promise<number> {
    const query = `
    from(bucket: "${this.influxClient.bucket}")
        |> range(start: 0)
        |> filter(fn: (r) => r.commit_sha == "${commitSHA}")
        |> filter(fn: (r) => r.module == "${module}")
        |> filter(fn: (r) => r._measurement == "number_endpoints")
    `;
    const rows = await this.influxClient.collectRows(query);
    return validateNumberEndpointsSchema(rows);
  }

  async getClassCount(commitSHA: string, module: string): Promise<number> {
    const query = `
    from(bucket: "${this.influxClient.bucket}")
        |> range(start: 0)
        |> filter(fn: (r) => r.commit_sha == "${commitSHA}")
        |> filter(fn: (r) => r.module == "${module}")
        |> filter(fn: (r) => r._measurement == "class_count")
    `;
    const rows = await this.influxClient.collectRows(query);
    return validateClassCountSchema(rows);
  }

  async getRepositoryMethodLengths(
    commitSHA: string,
    module: string,
  ): Promise<MethodLengthBucketDAO[]> {
    const query = `
    from(bucket: "${this.influxClient.bucket}")
        |> range(start: 0)
        |> filter(fn: (r) => r.commit_sha == "${commitSHA}")
        |> filter(fn: (r) => r.module == "${module}")
        |> filter(fn: (r) => r._measurement == "repository_method_length")
    `;
    const rows = await this.influxClient.collectRows(query);
    return validateMethodLengthBucketsSchema(rows);
  }

  async getSemanticClassType(
    commitSHA: string,
    module: string,
  ): Promise<SemanticClassTypeCountDAO> {
    const query = `
    from(bucket: "${this.influxClient.bucket}")
        |> range(start: 0)
        |> filter(fn: (r) => r.commit_sha == "${commitSHA}")
        |> filter(fn: (r) => r.module == "${module}")
        |> filter(fn: (r) => r._measurement == "semantic_class_type")
    `;
    const rows = await this.influxClient.collectRows(query);
    return validateSemanticClassTypeSchema(rows);
  }

  async getServiceMethodLengths(
    commitSHA: string,
    module: string,
  ): Promise<MethodLengthBucketDAO[]> {
    const query = `
    from(bucket: "${this.influxClient.bucket}")
        |> range(start: 0)
        |> filter(fn: (r) => r.commit_sha == "${commitSHA}")
        |> filter(fn: (r) => r.module == "${module}")
        |> filter(fn: (r) => r._measurement == "service_method_length")
    `;
    const rows = await this.influxClient.collectRows(query);
    return validateMethodLengthBucketsSchema(rows);
  }

  async getExternalServicesRepositoriesCount(
    commitSHA: string,
    module: string,
  ): Promise<ExternalServicesRepositoriesCountDAO> {
    const query = `
        from(bucket: "${this.influxClient.bucket}")
            |> range(start: 0)
            |> filter(fn: (r) => r.commit_sha == "${commitSHA}")
            |> filter(fn: (r) => r.module == "${module}")
            |> filter(fn: (r) => r._measurement == "external_services_repositories_count")
        `;
    const rows = await this.influxClient.collectRows(query);
    return validateExternalServicesRepositoriesCountSchema(rows);
  }

  private writePointsToInflux = async (
    points: InfluxMetricsPoint[],
    commitSHA: string,
    commitDate: Date,
    module: string,
  ) => {
    const result: Point[] = [];
    for (const { measurement, tags, fields } of points) {
      const point = new Point(measurement).timestamp(commitDate);

      if (tags !== undefined) {
        for (const [key, value] of Object.entries(tags)) {
          point.tag(key, `${value}`);
        }
      }

      for (const [key, value] of Object.entries(fields)) {
        if (typeof value === "number") {
          point.intField(key, value);
        } else if (typeof value === "boolean") {
          point.booleanField(key, value);
        } else {
          point.stringField(key, value);
        }
      }

      point.tag("commit_sha", commitSHA);
      point.tag("module", module);

      result.push(point);
    }

    this.influxClient.writePoints(result);
    await this.influxClient.close();
  };
}
