import { MetadataDAO } from "@server/domain/dao/metadata";

export interface IMetadataRepository {
  doesCommitExist(commitSHA: string): Promise<boolean>;
  saveMetadata(commitSHA: string, commitDate: Date, artifactID: string): Promise<void>;
  getNewestMetadata(): Promise<MetadataDAO | null>;
}
