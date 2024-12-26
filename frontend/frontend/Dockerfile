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

# Etapa 2: Configurar Nginx para servir los archivos
FROM nginx AS production-stage

# Copiar los archivos generados en la etapa de build al directorio de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx si es necesario
# (opcional: descomentar si tienes un archivo nginx.conf personalizado)
# COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]