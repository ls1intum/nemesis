WITH 'BOOT-INF.classes.de.tum.cit.aet.artemis' AS basePackageFQN
WITH basePackageFQN, size(split(basePackageFQN, '.')) AS baseDepth

MATCH (modulePackage:Package)
  WHERE modulePackage.fqn STARTS WITH basePackageFQN + '.'
  AND size(split(modulePackage.fqn, '.')) = baseDepth + 1
WITH modulePackage,
     split(modulePackage.fqn, '.')[baseDepth] AS moduleName

OPTIONAL MATCH (modulePackage)-[:CONTAINS*]->(clazz:Type)-[:DECLARES]->(method:Method)

OPTIONAL MATCH (method)-[:ANNOTATED_BY]->()-[:OF_TYPE]->(springAnnotation:Type)
  WHERE springAnnotation.fqn IN [
    'org.springframework.web.bind.annotation.GetMapping',
    'org.springframework.web.bind.annotation.PostMapping',
    'org.springframework.web.bind.annotation.PutMapping',
    'org.springframework.web.bind.annotation.PatchMapping',
    'org.springframework.web.bind.annotation.DeleteMapping'
  ]

WITH moduleName,
     COUNT(DISTINCT CASE WHEN springAnnotation.fqn = 'org.springframework.web.bind.annotation.GetMapping' THEN method END) AS getMappings,
     COUNT(DISTINCT CASE WHEN springAnnotation.fqn = 'org.springframework.web.bind.annotation.PostMapping' THEN method END) AS postMappings,
     COUNT(DISTINCT CASE WHEN springAnnotation.fqn = 'org.springframework.web.bind.annotation.PutMapping' THEN method END) AS putMappings,
     COUNT(DISTINCT CASE WHEN springAnnotation.fqn = 'org.springframework.web.bind.annotation.PatchMapping' THEN method END) AS patchMappings,
     COUNT(DISTINCT CASE WHEN springAnnotation.fqn = 'org.springframework.web.bind.annotation.DeleteMapping' THEN method END) AS deleteMappings

RETURN moduleName AS Module,
       getMappings,
       postMappings,
       putMappings,
       patchMappings,
       deleteMappings
  ORDER BY moduleName
