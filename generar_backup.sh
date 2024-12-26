#!/bin/bash

REQUEST="http://localhost:8080/empleado/generarInforme?fechaInicio=2024-12-24&fechaFin=$(date +"%Y-%m-%d")"

echo $REQUEST

TOKEN="Bearer $(curl -s -D - -X POST -H "Content-Type: application/json" -d "{\"nombre\":\"administrador\", \"password\":\"picoteo\"}" http://localhost:8080/login | awk '/^Authorization:/ {print $0}' | sed -n 's/^Authorization: \(.*\)/\1/p')"

echo $TOKEN

ZIP_FILE=~/informes_meson/hola.zip

curl -H "Authorization: $TOKEN" $REQUEST > $ZIP_FILE

unzip $ZIP_FILE -d ~/informes_meson/

rclone sync /home/lalo/informes_meson drive_meson:/informes_meson --progress
