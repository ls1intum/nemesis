WITH 'BOOT-INF.classes.de.tum.cit.aet.artemis' AS basePackageFQN
WITH basePackageFQN, size(split(basePackageFQN, '.')) AS baseDepth

MATCH (modulePackage:Package)
  WHERE modulePackage.fqn STARTS WITH basePackageFQN + '.'
  AND size(split(modulePackage.fqn, '.')) = baseDepth + 1
WITH modulePackage,
     split(modulePackage.fqn, '.')[baseDepth] AS internalModuleName,
     basePackageFQN

OPTIONAL MATCH (modulePackage)-[:CONTAINS*]->(internalClazz:Type)-[:DEPENDS_ON]->(externalClazz:Type)
  WHERE NOT externalClazz.fqn CONTAINS internalModuleName
  AND externalClazz.fqn STARTS WITH "de.tum.cit"
  AND (externalClazz.fqn CONTAINS ".repository." OR externalClazz.fqn CONTAINS ".service.")

WITH internalModuleName,
     externalClazz.fqn AS externalClassName,
     COUNT(DISTINCT internalClazz) AS usageCount,
     split(externalClazz.fqn, '.')[5] AS externalModuleName

WITH externalModuleName, internalModuleName, externalClassName, usageCount
  ORDER BY usageCount DESC

RETURN internalModuleName AS moduleName,
       collect({externalModule: externalModuleName, externalClass: externalClassName, count: usageCount}) AS sortedExternalClassMapping
