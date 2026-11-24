FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline

COPY src/ src/
RUN ./mvnw -B -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app

RUN groupadd --system spring && useradd --system --gid spring --create-home spring \
    && mkdir -p /app/uploads \
    && chown -R spring:spring /app

COPY --from=build --chown=spring:spring /workspace/target/*.jar /app/app.jar

USER spring

EXPOSE 9000
VOLUME ["/app/uploads"]

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
