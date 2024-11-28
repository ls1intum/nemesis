import type { EndpointTypeCountDAO } from "./endpointTypeCount";
import type { SemanticClassTypeCountDAO } from "./semanticClassTypeCount";

export type GeneralMetricsDAO = {
  linesOfCode: number;
  numberEndpoints: number;
  classCount: number;
  semanticClassType: SemanticClassTypeCountDAO;
  endpointTypeCount: EndpointTypeCountDAO;
  numberEntity: number;
  numberEntityGraphs: number;
};
