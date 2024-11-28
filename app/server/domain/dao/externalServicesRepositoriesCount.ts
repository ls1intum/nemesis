export type ExternalServicesRepositoriesCountDAO = ExternalServicesRepositoriesCountEntryDAO[];

export type ExternalServicesRepositoriesCountEntryDAO = {
  externalClass: string;
  externalModule: string;
  count: number;
};
