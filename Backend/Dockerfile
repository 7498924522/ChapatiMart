FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY target/*.jar app.jar
COPY certs/ca.pem /app/ca.pem

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
