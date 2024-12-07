import type { Metadata } from "next";
import applicationContainer from "@server/applicationContainer";
import { SimpleMetricsCard } from "@components/organisms/SimpleMetricsCard";
import { ControllerTypeBarChart } from "@components/organisms/ControllerTypeBarChart";
import { ClassTypeBarChartCard } from "@components/organisms/ClassTypeBarChartCard";
import { MethodLengthsBarChart } from "@components/organisms/MethodLengthsBarChart";
import { SemanticClassTypeCountDAO } from "@server/domain/dao/semanticClassTypeCount";
import { ExternalClassUsageDAO } from "@server/domain/dao/externalClassUsage";
import { ModuleSelect } from "@components/organisms/ModuleSelector";
import { CommitSHALink } from "@components/organisms/CommitSHALink";
import { ExternalClassUsageCountTable } from "@components/organisms/ExternalClassUsageTable";

export const metadata: Metadata = {
  title: "Artemis Metrics",
  description: "Discover metrics on the server modules of Artemis.",
};

interface HomeProps {
  searchParams: Promise<{ module?: string }>;
}

const modules = [
  "assessment",
  "athena",
  "atlas",
  "buildagent",
  "communication",
  "core",
  "exam",
  "exercise",
  "iris",
  "lecture",
  "lti",
  "modeling",
  "plagiarism",
  "programming",
  "quiz",
];

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const selectedModule = params.module ?? modules[0];

  const metadataService = applicationContainer.getMetadataService();
  const metadata = await metadataService.getNewestMetadata();
  if (!metadata) {
    return (
      <p>
        No metrics available. You might need to trigger a (first) metrics scrape which can take a
        few seconds to be retrievable from the InfluxDB.
      </p>
    );
  }

  const metricsService = applicationContainer.getMetricsService();
  const generalMetrics = await metricsService.getGeneralMetrics(metadata.commitSHA, selectedModule);
  const codeComplexityMetrics = await metricsService.getCodeComplexityMetrics(
    metadata.commitSHA,
    selectedModule,
  );
  const externalModuleUsageMetrics = await metricsService.getExternalModuleUsageMetrics(
    metadata.commitSHA,
    selectedModule,
  );

  return (
    <div className="text-center">
      <h1 className="pb-4 text-5xl font-bold">Artemis Metrics</h1>
      <p className="pb-10">Discover metrics on the server modules of Artemis.</p>

      <div className="flex items-center justify-between">
        <ModuleSelect modules={modules} selectedModule={selectedModule} />
        {metadata.commitSHA && <CommitSHALink commitSHA={metadata.commitSHA} />}
      </div>

      <p className="py-3 text-left text-muted-foreground">General Metrics</p>
      <div className="grid gap-5 pb-10 sm:grid-cols-3">
        <SimpleMetricsCard label="Lines of Code" value={generalMetrics.linesOfCode} />
        <ClassTypeBarChartCard
          title="Semantic Class Type Count"
          className="row-span-2"
          chartData={semanticClassTypeChartData(generalMetrics.semanticClassType)}
        />
        <ControllerTypeBarChart
          className="row-span-2"
          endpointTypeCount={generalMetrics.endpointTypeCount}
        />
        <SimpleMetricsCard label="Number Endpoints" value={generalMetrics.numberEndpoints} />
        <SimpleMetricsCard label="Number Classes" value={generalMetrics.classCount} />
        <SimpleMetricsCard label="Number @Entity" value={generalMetrics.numberEntity} />
        <SimpleMetricsCard label="Number @EntityGraph" value={generalMetrics.numberEntityGraphs} />
      </div>

      <p className="pb-3 text-left text-muted-foreground">Code Complexity</p>
      <div className="grid gap-5 pb-10 sm:grid-cols-3">
        <MethodLengthsBarChart
          color="hsl(var(--controller))"
          title="REST Controller Method Length (LOC)"
          methodLengths={codeComplexityMetrics.controllerMethodLengths}
        />
        <MethodLengthsBarChart
          color="hsl(var(--service))"
          title="Service Method Length (LOC)"
          methodLengths={codeComplexityMetrics.serviceMethodLengths}
        />
        <MethodLengthsBarChart
          color="hsl(var(--repository))"
          title="Repository Method Length (LOC)"
          methodLengths={codeComplexityMetrics.repositoryMethodLengths}
        />
      </div>

      <p className="pb-3 text-left text-muted-foreground">External Module Usage</p>
      <div className="grid gap-5 pb-10 sm:grid-cols-3">
        <ClassTypeBarChartCard
          title="External Classes Used Count (Distinct)"
          chartData={classTypeChartData(externalModuleUsageMetrics.externalClassList)}
        />
        <ExternalClassUsageCountTable
          className="max-h-[400px] overflow-x-scroll sm:col-span-2"
          externalServicesRepositoriesCount={
            externalModuleUsageMetrics.externalServicesRepositoriesCount
          }
        />
      </div>
    </div>
  );
}

function semanticClassTypeChartData(semanticClassTypeCount: SemanticClassTypeCountDAO) {
  return [
    {
      semanticClassType: "Controller",
      count: semanticClassTypeCount.controller,
      fill: "var(--color-controller)",
    },
    {
      semanticClassType: "Service",
      count: semanticClassTypeCount.service,
      fill: "var(--color-service)",
    },
    {
      semanticClassType: "Repository",
      count: semanticClassTypeCount.repository,
      fill: "var(--color-repository)",
    },
    {
      semanticClassType: "Entity",
      count: semanticClassTypeCount.entity,
      fill: "var(--color-entity)",
    },
    { semanticClassType: "DTO", count: semanticClassTypeCount.dto, fill: "var(--color-dto)" },
  ];
}

function classTypeChartData(classTypeCount: ExternalClassUsageDAO) {
  return [
    {
      semanticClassType: "Controller",
      count: classTypeCount.resources.length,
      fill: "var(--color-controller)",
    },
    {
      semanticClassType: "Service",
      count: classTypeCount.services.length,
      fill: "var(--color-service)",
    },
    {
      semanticClassType: "Repository",
      count: classTypeCount.repository.length,
      fill: "var(--color-repository)",
    },
    {
      semanticClassType: "Entity",
      count: classTypeCount.entities.length,
      fill: "var(--color-entity)",
    },
    { semanticClassType: "DTO", count: classTypeCount.dtos.length, fill: "var(--color-dto)" },
  ];
}
