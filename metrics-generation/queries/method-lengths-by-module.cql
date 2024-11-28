WITH 'BOOT-INF.classes.de.tum.cit.aet.artemis' AS basePackageFQN

WITH basePackageFQN, size(split(basePackageFQN, '.')) AS baseDepth

MATCH (package:Package)-[:CONTAINS*]->(clazz:Type)-[:DECLARES]->(method:Method)
  WHERE (
  clazz.name ENDS WITH 'Repository' OR
  clazz.name ENDS WITH 'Service' OR
  clazz.name ENDS WITH 'Resource'
  )
  AND package.fqn STARTS WITH basePackageFQN + '.'
  AND method.name <> '<init>'
  AND method.name <> '<clinit>'
  AND NOT method.name STARTS WITH 'lambda'

WITH package.fqn AS packageName,
     clazz.name AS className,
     method.effectiveLineCount AS methodLength,
     baseDepth,
     basePackageFQN

WITH split(packageName, '.')[baseDepth] AS moduleName,
     className,
     methodLength,
     basePackageFQN,
     baseDepth

WITH moduleName,
     CASE
       WHEN className ENDS WITH 'Repository' THEN 'Repository'
       WHEN className ENDS WITH 'Service' THEN 'Service'
       WHEN className ENDS WITH 'Resource' THEN 'Resource'
       ELSE 'Other'
       END AS classType,
     methodLength

WITH moduleName,
     collect(
     CASE
       WHEN classType = 'Repository' THEN methodLength
       ELSE NULL
       END
     ) AS repositoryMethodLengths,
     collect(
     CASE
       WHEN classType = 'Service' THEN methodLength
       ELSE NULL
       END
     ) AS serviceMethodLengths,
     collect(
     CASE
       WHEN classType = 'Resource' THEN methodLength
       ELSE NULL
       END
     ) AS resourceMethodLengths

WITH moduleName,
     [length IN repositoryMethodLengths WHERE length IS NOT NULL] AS repositoryMethodLengths,
     [length IN serviceMethodLengths WHERE length IS NOT NULL] AS serviceMethodLengths,
     [length IN resourceMethodLengths WHERE length IS NOT NULL] AS resourceMethodLengths

RETURN moduleName AS Module,
       repositoryMethodLengths,
       serviceMethodLengths,
       resourceMethodLengths
  ORDER BY moduleName
