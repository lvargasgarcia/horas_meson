# Etapa 1: Construir el proyecto
FROM node AS build-stage

# Crear y usar el directorio de la app
WORKDIR /app

# Copiar archivos de la aplicación al contenedor
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente al contenedor
COPY . .

# Ejecutar el build de Vite
RUN npm run build

# Etapa 2: Configurar Apache para servir los archivos
FROM httpd:alpine AS production-stage

# Copiar los archivos generados en la etapa de build al directorio de Apache
COPY --from=build-stage /app/dist /usr/local/apache2/htdocs/

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Apache (no es necesario añadir CMD, ya que la imagen de Apache ya lo hace por defecto)