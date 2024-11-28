WITH 'BOOT-INF.classes.de.tum.cit.aet.artemis' AS basePackageFQN

WITH basePackageFQN, size(split(basePackageFQN, '.')) AS baseDepth

MATCH (modulePackage:Package)
  WHERE modulePackage.fqn STARTS WITH basePackageFQN + '.'
  AND size(split(modulePackage.fqn, '.')) = baseDepth + 1

WITH modulePackage,
     split(modulePackage.fqn, '.')[baseDepth] AS moduleName,
     basePackageFQN,
     baseDepth

MATCH (modulePackage)-[:CONTAINS*]->(clazz:Type)-[:DECLARES]->(method:Method)

WITH moduleName,
     method.effectiveLineCount AS methodLength

WITH moduleName, sum(methodLength) AS totalLines

RETURN moduleName AS Module,
       totalLines AS TotalLinesOfCode
  ORDER BY Module
