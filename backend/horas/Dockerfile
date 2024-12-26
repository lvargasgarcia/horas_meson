# Usa una imagen base de JDK para ejecutar el JAR
FROM openjdk:21-jdk-slim

# Establece un directorio de trabajo en el contenedor
WORKDIR /app

# Copia el JAR generado en la imagen
ARG JAR_FILE=target/horas-0.0.1-SNAPSHOT.jar 
COPY ${JAR_FILE} app.jar

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
ENTRYPOINT ["java", "-jar", "app.jar"]

