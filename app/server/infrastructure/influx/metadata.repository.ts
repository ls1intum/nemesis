/* eslint-disable */
import { Point } from "@influxdata/influxdb-client";
import { InfluxClient } from "@server/infrastructure/influx/influx";
import { IMetadataRepository } from "@server/domain/repository/metada.repository";
import { MetadataDAO } from "@server/domain/dao/metadata";

export class metadataRepositoryImpl implements IMetadataRepository {
  constructor(private readonly influxClient: InfluxClient) {}

  async doesCommitExist(commitSHA: string) {
    const fluxQuery = `
    from(bucket: "${this.influxClient.bucket}")
      |> range(start: 0)
      |> filter(fn: (r) => r._measurement == "metadata" and r.commit_sha == "${commitSHA}")
      |> limit(n:1)
  `;

    try {
      const rows = await this.influxClient.collectRows(fluxQuery);
      return rows.length > 0;
    } catch {
      throw new Error("Failed to check if commit exists in InfluxDB");
    }
  }

  async saveMetadata(commitSHA: string, commitDate: Date, artifactID: string) {
    const point = new Point("metadata")
      .tag("commit_sha", commitSHA)
      .stringField("artifactID", artifactID)
      .timestamp(commitDate);

    this.influxClient.writePoint(point);
    await this.influxClient.close();
  }

  async getNewestMetadata(): Promise<MetadataDAO | null> {
    const query = `
    from(bucket: "${this.influxClient.bucket}")
      |> range(start: 0)
      |> filter(fn: (r) => r._measurement == "metadata")
      |> sort(columns: ["_time"], desc: true)
      |> limit(n: 1)
  `;

    const response = await this.influxClient.collectRows(query);

    let newestMetadata = null;
    // ToDo: validate correctly
    response.forEach((row) => {
      newestMetadata = {
        commitSHA: (row as any).commit_sha,
        commitDate: new Date((row as any)._time),
        artifactID: (row as any).artifactID,
      };
    });

    return newestMetadata;
  }
}
