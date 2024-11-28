import { NextRequest, NextResponse } from "next/server";
import applicationContainer from "@server/applicationContainer";

export async function POST(request: NextRequest) {
  const metricsSourceRepository = applicationContainer.getMetricsSourceRepository();
  const metricsService = applicationContainer.getMetricsService();
  const metadataService = applicationContainer.getMetadataService();

  try {
    const { artifactID } = await request.json();
    if (!artifactID) {
      return NextResponse.json({ error: "Missing artifactID" }, { status: 400 });
    }

    const { metadata, metricsByModule } = await metricsSourceRepository.getMetrics(artifactID);
    const { commitSHA, commitDate } = metadata;

    const commitExists = await metadataService.doesCommitExist(commitSHA);
    if (commitExists) {
      return NextResponse.json(
        { error: `Metrics for commit ${commitSHA} already exists` },
        { status: 400 },
      );
    }

    await metadataService.saveMetadata(commitSHA, commitDate, artifactID);
    await metricsService.saveMetrics(metricsByModule, commitSHA, commitDate);

    return NextResponse.json(
      { message: `Metadata and Metrics for commit '${commitSHA}' written to InfluxDB` },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error?.toString() }, { status: 500 });
  }
}
