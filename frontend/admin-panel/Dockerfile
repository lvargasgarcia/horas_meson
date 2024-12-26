# Usa la imagen base de NGINX
FROM nginx:alpine

# Copia los archivos generados por Vite al directorio de NGINX
COPY dist /usr/share/nginx/html

# Copia la configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para ejecutar NGINX
CMD ["nginx", "-g", "daemon off;"]

