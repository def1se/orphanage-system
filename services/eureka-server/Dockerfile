# ─── Этап 1: Сборка ────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Копируем parent POM
COPY pom.xml ./pom.xml

# Копируем pom.xml и исходники сервиса
COPY services/eureka-server/pom.xml ./services/eureka-server/pom.xml
COPY services/eureka-server/src ./services/eureka-server/src

RUN --mount=type=cache,target=/root/.m2 \
    mvn -f services/eureka-server/pom.xml package -DskipTests

# ─── Этап 2: Runtime ───────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring

COPY --from=builder /app/services/eureka-server/target/*.jar app.jar

EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]

