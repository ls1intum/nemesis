WITH 'BOOT-INF.classes.de.tum.cit.aet.artemis' AS basePackageFQN
WITH basePackageFQN, size(split(basePackageFQN, '.')) AS baseDepth

MATCH (modulePackage:Package)
  WHERE modulePackage.fqn STARTS WITH basePackageFQN + '.'
  AND size(split(modulePackage.fqn, '.')) = baseDepth + 1
WITH modulePackage,
     split(modulePackage.fqn, '.')[baseDepth] AS moduleName,
     basePackageFQN,
     baseDepth

MATCH (modulePackage)-[:CONTAINS*]->(clazz:Type)-[r]->(dep:Type)
  WHERE type(r) IN ['DEPENDS_ON', 'USES', 'CALLS', 'READS', 'WRITES']
  AND (
  dep.name ENDS WITH 'Service' OR
  dep.name ENDS WITH 'DTO' OR
  dep.name ENDS WITH 'Repository' OR
  dep.name ENDS WITH 'Resource' OR
  EXISTS {
  MATCH (dep)-[:ANNOTATED_BY]->()-[:OF_TYPE]->(springAnnotation:Type)
    WHERE springAnnotation.fqn = 'jakarta.persistence.Entity'
  }
  )

MATCH (depPackage:Package)-[:CONTAINS*]->(dep)
  WHERE depPackage.fqn STARTS WITH basePackageFQN + '.'

WITH moduleName, dep, depPackage,
     split(depPackage.fqn, '.')[baseDepth] AS depModuleName

  WHERE depModuleName <> moduleName

WITH moduleName,
     CASE
       WHEN dep.name ENDS WITH 'Service' THEN dep.fqn
       END AS externalService,
     CASE
       WHEN dep.name ENDS WITH 'DTO' THEN dep.fqn
       END AS externalDTO,
     CASE
       WHEN dep.name ENDS WITH 'Repository' THEN dep.fqn
       END AS externalRepository,
     CASE
       WHEN dep.name ENDS WITH 'Resource' THEN dep.fqn
       END AS externalResource,
     CASE
       WHEN EXISTS {
     MATCH (dep)-[:ANNOTATED_BY]->()-[:OF_TYPE]->(springAnnotation:Type)
       WHERE springAnnotation.fqn = 'jakarta.persistence.Entity'
     } THEN dep.fqn
       END AS externalEntity

WITH moduleName,
     collect(DISTINCT externalService) AS ExternalServicesUsed,
     collect(DISTINCT externalDTO) AS ExternalDTOsUsed,
     collect(DISTINCT externalRepository) AS ExternalRepositoriesUsed,
     collect(DISTINCT externalResource) AS ExternalResourcesUsed,
     collect(DISTINCT externalEntity) AS ExternalEntitiesUsed

RETURN moduleName AS Module,
       ExternalServicesUsed,
       ExternalDTOsUsed,
       ExternalRepositoriesUsed,
       ExternalResourcesUsed,
       ExternalEntitiesUsed
  ORDER BY moduleName
