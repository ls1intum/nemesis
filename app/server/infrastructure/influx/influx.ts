import { InfluxDB, Point } from "@influxdata/influxdb-client";

export type InfluxMetricsPoint = {
  measurement: string;
  tags?: Record<string, string | number>;
  fields: Record<string, number | string | boolean>;
};

export class InfluxClient {
  private readonly client: InfluxDB;
  readonly org: string;
  readonly bucket: string;

  constructor(url: string, token: string, org: string, bucket: string) {
    this.client = new InfluxDB({
      url: url,
      token: token,
    });
    this.org = org;
    this.bucket = bucket;
  }

  /**
   * Writes a point to the InfluxDB. However, it does not flush the results, yet.
   * Call `close` to flush the results.
   */
  public writePoint(point: Point) {
    this.client.getWriteApi(this.org, this.bucket).writePoint(point);
  }

  /**
   * Writes multiple points to the InfluxDB. However, it does not flush the results, yet.
   * Call `close` to flush the results.
   */
  public writePoints(points: Point[]) {
    this.client.getWriteApi(this.org, this.bucket).writePoints(points);
  }

  async close() {
    await this.client.getWriteApi(this.org, this.bucket).close();
  }

  public async collectRows(fluxQuery: string) {
    try {
      return await this.client.getQueryApi(this.org).collectRows(fluxQuery);
    } catch {
      throw new Error("Failed to collect rows");
    }
  }
}
