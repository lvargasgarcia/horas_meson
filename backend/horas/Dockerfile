# Usa una imagen base con Maven y JDK para construir la aplicación
FROM maven:latest AS build

# Establece un directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo pom.xml y el código fuente al contenedor
COPY pom.xml .
COPY src/ ./src/

# Ejecuta 'mvn package' para construir el JAR
RUN mvn clean package -DskipTests

# Usa una imagen base de JDK para ejecutar el JAR
FROM openjdk:21-jdk-slim

# Instala la librería faltante libfreetype6
RUN apt-get update && apt-get install -y libfreetype6 fontconfig && rm -rf /var/lib/apt/lists/*

# Establece un directorio de trabajo en el contenedor
WORKDIR /app

# Copia el JAR generado desde la fase de build
COPY --from=build /app/target/horas-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto del servidor configurado en application.properties (8080 por defecto)
EXPOSE 8080

# Usa variables de entorno para configurar la aplicación
ENV SPRING_APPLICATION_NAME=horas \
    SERVER_PORT=8080 \
    SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/meson \
    SPRING_DATASOURCE_USERNAME=lalo \
    SPRING_DATASOURCE_PASSWORD=7175 \
    JWT_SECRET=defaultsecret \
    JWT_TOKEN_VALIDITY=600

# Comando para ejecutar el JAR
ENTRYPOINT ["java", "-Xms128m", "-Xmx512m", "-jar", "app.jar"]