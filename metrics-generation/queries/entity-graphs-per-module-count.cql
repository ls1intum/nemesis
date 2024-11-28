WITH 'BOOT-INF.classes.de.tum.cit.aet.artemis' AS basePackageFQN
WITH basePackageFQN, size(split(basePackageFQN, '.')) AS baseDepth

MATCH (modulePackage:Package)
  WHERE modulePackage.fqn STARTS WITH basePackageFQN + '.'
  AND size(split(modulePackage.fqn, '.')) = baseDepth + 1
WITH modulePackage,
     split(modulePackage.fqn, '.')[baseDepth] AS moduleName

OPTIONAL MATCH (modulePackage)-[:CONTAINS*]->(clazz:Type)-[:DECLARES]->(method:Method)
OPTIONAL MATCH (method)-[:ANNOTATED_BY]->()-[:OF_TYPE]->(springAnnotation:Type)
  WHERE springAnnotation.fqn = 'org.springframework.data.jpa.repository.EntityGraph'
WITH moduleName,
     COUNT(DISTINCT CASE WHEN springAnnotation IS NOT NULL THEN method.signature END) AS numberEntityGraphs

RETURN moduleName AS Module, numberEntityGraphs
  ORDER BY moduleName
