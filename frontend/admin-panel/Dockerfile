# Usa una imagen base de Node.js (con Alpine para ser más ligera)
FROM node:18-alpine AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json (o yarn.lock) para instalar dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia todo el código fuente del proyecto al contenedor
COPY . .

# Ejecuta el build de Vite
RUN npm run build

# Usa la imagen base de NGINX para servir los archivos estáticos generados por Vite
FROM nginx:alpine

# Copia los archivos generados por Vite al directorio de NGINX
COPY --from=build /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para ejecutar NGINX
CMD ["nginx", "-g", "daemon off;"]


