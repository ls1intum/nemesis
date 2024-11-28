import AdmZip from "adm-zip";

export class ZipClient {
  public extractFilesFromZip = (
    zipBuffer: Buffer,
    expectedFileNames: string[],
  ): Record<string, string> => {
    const zip = new AdmZip(zipBuffer);
    const extractedFiles: Record<string, string> = {};

    for (const fileName of expectedFileNames) {
      const entry = zip.getEntry(fileName);
      if (!entry) {
        throw new Error(`Required file "${fileName}" not found in the artifact.`);
      }
      extractedFiles[fileName] = entry.getData().toString("utf8");
    }

    return extractedFiles;
  };
}
