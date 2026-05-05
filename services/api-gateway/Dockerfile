FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

COPY pom.xml ./pom.xml
COPY services/api-gateway/pom.xml ./services/api-gateway/pom.xml
COPY services/api-gateway/src ./services/api-gateway/src

RUN mvn -f services/api-gateway/pom.xml package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring

COPY --from=builder /app/services/api-gateway/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

