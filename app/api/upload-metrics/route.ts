import { NextRequest, NextResponse } from "next/server";
import applicationContainer from "@server/applicationContainer";
import { parseMetrics } from "@server/infrastructure/neo4j/metricsSource";

export async function POST(request: NextRequest) {
  if (process.env.METRICS_UPLOAD_ENABLED !== "true") {
    return NextResponse.json({ error: "Metrics upload is disabled" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const zipFile = formData.get("file");
    const mimeType = formData.get("mimeType");

    if (mimeType !== "application/x-zip" || !(zipFile instanceof File)) {
      return NextResponse.json({ error: "File and MIME type are required" }, { status: 400 });
    }

    const buffer = Buffer.from(await zipFile.arrayBuffer());
    const { metadata, metricsByModule } = parseMetrics(buffer, applicationContainer.getZipClient());

    const metadataService = applicationContainer.getMetadataService();
    await metadataService.saveMetadata(metadata.commitSHA, metadata.commitDate, "n.a.");

    const metricsService = applicationContainer.getMetricsService();
    await metricsService.saveMetrics(metricsByModule, metadata.commitSHA, metadata.commitDate);

    return NextResponse.json(
      { message: `Metadata and Metrics for commit '${metadata.commitSHA}' written to InfluxDB` },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error?.toString() }, { status: 500 });
  }
}
