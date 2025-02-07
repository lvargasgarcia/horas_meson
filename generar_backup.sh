#!/bin/bash

HOSTNAME="backend.horaspicoteo.duckdns.org"

ADMIN_USERNAME="administrador"
ADMIN_PASSWORD="picoteo"

REQUEST="https://$HOSTNAME/empleado/generarInforme?fechaInicio=2024-12-24&fechaFin=$(date +"%Y-%m-%d")"

echo $REQUEST

TOKEN="$(curl -s -D - -X POST -H "Content-Type: application/json" -d "{\"nombre\":\"$ADMIN_USERNAME\", \"password\":\"$ADMIN_PASSWORD\"}" https://$HOSTNAME/login | awk '/^Authorization:/ {print $0}' | sed -n 's/^Authorization: \(.*\)/\1/p')"

ZIP_FILE=~/informes_meson/$(date +"%Y-%m-%d").zip
TARGET_DIR=~/informes_meson/$(date +"%Y-%m-%d")

rm $ZIP_FILE
rm -r $TARGET_DIR

http GET $REQUEST Authorization:"Bearer $TOKEN" > $ZIP_FILE

unzip $ZIP_FILE -d $TARGET_DIR 

rclone sync /home/lalo/informes_meson drive_meson:/informes_meson --progress

