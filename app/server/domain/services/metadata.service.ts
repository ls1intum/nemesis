import type { IMetadataRepository } from "@server/domain/repository/metada.repository";
import { MetadataDAO } from "@server/domain/dao/metadata";

export interface IMetadataService {
  doesCommitExist(commitSHA: string): Promise<boolean>;
  saveMetadata(commitSHA: string, commitDate: Date, artifactID: string): Promise<void>;
  getNewestMetadata(): Promise<MetadataDAO | null>;
}

export class metadataServiceImpl implements IMetadataService {
  private metadataRepository: IMetadataRepository;

  constructor(metadataRepository: IMetadataRepository) {
    this.metadataRepository = metadataRepository;
  }

  async doesCommitExist(commitSHA: string) {
    return await this.metadataRepository.doesCommitExist(commitSHA);
  }

  async saveMetadata(commitSHA: string, commitDate: Date, artifactID: string) {
    return await this.metadataRepository.saveMetadata(commitSHA, commitDate, artifactID);
  }

  async getNewestMetadata() {
    return await this.metadataRepository.getNewestMetadata();
  }
}
