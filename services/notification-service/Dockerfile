FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

COPY pom.xml ./pom.xml
COPY services/notification-service/pom.xml ./services/notification-service/pom.xml
COPY services/notification-service/src ./services/notification-service/src

RUN mvn -f services/notification-service/pom.xml package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring

COPY --from=builder /app/services/notification-service/target/*.jar app.jar

EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]

