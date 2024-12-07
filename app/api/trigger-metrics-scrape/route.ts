import { NextRequest } from "next/server";
import applicationContainer from "@server/applicationContainer";
import { JSONResponse } from "../responses";

export async function POST(request: NextRequest) {
  const metricsSourceRepository = applicationContainer.getMetricsSourceRepository();
  const metricsService = applicationContainer.getMetricsService();
  const metadataService = applicationContainer.getMetadataService();

  try {
    const { artifactID } = await request.json();
    if (!artifactID) {
      return JSONResponse(400, { error: "Missing artifactID" });
    }

    const { metadata, metricsByModule } = await metricsSourceRepository.getMetrics(artifactID);
    const { commitSHA, commitDate } = metadata;

    const commitExists = await metadataService.doesCommitExist(commitSHA);
    if (commitExists) {
      return JSONResponse(400, { error: `Metrics for commit ${commitSHA} already exists` });
    }

    await metadataService.saveMetadata(commitSHA, commitDate, artifactID);
    await metricsService.saveMetrics(metricsByModule, commitSHA, commitDate);

    return JSONResponse(200, {
      message: `Metadata and Metrics for commit '${commitSHA}' written to InfluxDB`,
    });
  } catch (error) {
    return JSONResponse(500, { error });
  }
}
