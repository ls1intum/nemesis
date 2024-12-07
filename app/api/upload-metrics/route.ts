import { NextRequest } from "next/server";
import applicationContainer from "@server/applicationContainer";
import { parseMetrics } from "@server/infrastructure/neo4j/metricsSource";
import { JSONResponse } from "../responses";

export async function POST(request: NextRequest) {
  if (process.env.METRICS_UPLOAD_ENABLED !== "true") {
    return JSONResponse(400, { error: "Metrics upload is disabled" });
  }

  try {
    const formData = await request.formData();
    const zipFile = formData.get("file");
    const mimeType = formData.get("mimeType");

    if (mimeType !== "application/x-zip" || !(zipFile instanceof File)) {
      return JSONResponse(400, { error: "File and MIME type are required" });
    }

    const buffer = Buffer.from(await zipFile.arrayBuffer());
    const { metadata, metricsByModule } = parseMetrics(buffer, applicationContainer.getZipClient());

    const metadataService = applicationContainer.getMetadataService();
    await metadataService.saveMetadata(metadata.commitSHA, metadata.commitDate, "n.a.");

    const metricsService = applicationContainer.getMetricsService();
    await metricsService.saveMetrics(metricsByModule, metadata.commitSHA, metadata.commitDate);

    return JSONResponse(200, {
      message: `Metadata and Metrics for commit '${metadata.commitSHA}' written to InfluxDB`,
    });
  } catch (error) {
    return JSONResponse(500, { error });
  }
}
