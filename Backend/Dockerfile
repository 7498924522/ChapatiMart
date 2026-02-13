# Use Java 21 (required — your jar compiled with 21)
FROM eclipse-temurin:21-jdk

WORKDIR /app

# copy project
COPY . .

# build jar inside container
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# run app
EXPOSE 8080
CMD ["java","-jar","target/*.jar"]
