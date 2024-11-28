WITH 'BOOT-INF.classes.de.tum.cit.aet.artemis' AS basePackageFQN

WITH basePackageFQN, size(split(basePackageFQN, '.')) AS baseDepth

MATCH (modulePackage:Package)
  WHERE modulePackage.fqn STARTS WITH basePackageFQN + '.'
  AND size(split(modulePackage.fqn, '.')) = baseDepth + 1
WITH modulePackage,
     split(modulePackage.fqn, '.')[baseDepth] AS moduleName

OPTIONAL MATCH (modulePackage)-[:CONTAINS*]->(clazz:Type)-[:ANNOTATED_BY]->()-[:OF_TYPE]->(annotation:Type)
  WHERE annotation.fqn IN [
    "org.springframework.web.bind.annotation.RestController",
    "org.springframework.stereotype.Service",
    "org.springframework.stereotype.Repository",
    "jakarta.persistence.Entity"
  ]

WITH modulePackage, moduleName,
     COUNT(DISTINCT CASE WHEN annotation.fqn = "org.springframework.web.bind.annotation.RestController" THEN clazz END) AS numberController,
     COUNT(DISTINCT CASE WHEN annotation.fqn = "org.springframework.stereotype.Service" THEN clazz END) AS numberService,
     COUNT(DISTINCT CASE WHEN annotation.fqn = "org.springframework.stereotype.Repository" THEN clazz END) AS numberRepository,
     COUNT(DISTINCT CASE WHEN annotation.fqn = "jakarta.persistence.Entity" THEN clazz END) AS numberEntities

OPTIONAL MATCH (modulePackage)-[:CONTAINS*]->(dtoClazz:Type)
  WHERE dtoClazz.name ENDS WITH 'DTO'

WITH moduleName,
     numberController,
     numberService,
     numberRepository,
     numberEntities,
     COUNT(DISTINCT dtoClazz) AS numberDTOs

RETURN moduleName AS Module,
       numberController,
       numberService,
       numberRepository,
       numberEntities,
       numberDTOs
  ORDER BY moduleName
