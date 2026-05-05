FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

COPY pom.xml ./pom.xml
COPY services/adoption-service/pom.xml ./services/adoption-service/pom.xml
COPY services/adoption-service/src ./services/adoption-service/src

RUN mvn -f services/adoption-service/pom.xml package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring

COPY --from=builder /app/services/adoption-service/target/*.jar app.jar

EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]

