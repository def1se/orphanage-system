FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

COPY pom.xml ./pom.xml
COPY services/inventory-service/pom.xml ./services/inventory-service/pom.xml
COPY services/inventory-service/src ./services/inventory-service/src

RUN mvn -f services/inventory-service/pom.xml package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring

COPY --from=builder /app/services/inventory-service/target/*.jar app.jar

EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]

