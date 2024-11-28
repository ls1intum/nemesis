WITH 'BOOT-INF.classes.de.tum.cit.aet.artemis' AS basePackageFQN
WITH basePackageFQN, size(split(basePackageFQN, '.')) AS baseDepth

MATCH (modulePackage:Package)
  WHERE modulePackage.fqn STARTS WITH basePackageFQN + '.'
  AND size(split(modulePackage.fqn, '.')) = baseDepth + 1
WITH modulePackage,
     split(modulePackage.fqn, '.')[baseDepth] AS moduleName

OPTIONAL MATCH (modulePackage)-[:CONTAINS*]->(clazz:Type)
WITH moduleName, COUNT(DISTINCT clazz) AS numberOfClasses

RETURN moduleName AS Module, numberOfClasses
  ORDER BY moduleName
