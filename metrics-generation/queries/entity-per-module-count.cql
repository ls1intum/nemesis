WITH 'BOOT-INF.classes.de.tum.cit.aet.artemis' AS basePackageFQN
WITH basePackageFQN, size(split(basePackageFQN, '.')) AS baseDepth

MATCH (modulePackage:Package)
  WHERE modulePackage.fqn STARTS WITH basePackageFQN + '.'
  AND size(split(modulePackage.fqn, '.')) = baseDepth + 1
WITH modulePackage,
     split(modulePackage.fqn, '.')[baseDepth] AS moduleName

MATCH (modulePackage)-[:CONTAINS*]->(clazz:Type)
MATCH (clazz)-[:ANNOTATED_BY]->()-[:OF_TYPE]->(springAnnotation:Type)
  WHERE springAnnotation.fqn = 'jakarta.persistence.Entity'
WITH moduleName, COUNT(clazz) AS numberEntity

RETURN moduleName AS Module, numberEntity
  ORDER BY moduleName
