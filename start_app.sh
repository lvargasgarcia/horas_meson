#!/bin/bash

# Generate a 64-byte (512-bit) random key encoded in Base64
JWT_SECRET=$(openssl rand -base64 64)

# Write the correct syntax to the .env file
echo "JWT_SECRET=\"${JWT_SECRET}\"" > .env

echo "Generated new JWT secret."

# Determine if detached mode (-d) should be used
if [[ "$1" == "-d" ]]; then
  docker compose up -d
elif [[ -z "$1" ]]; then #if no argument was passed
    docker compose up
else
  echo "Invalid argument: $1"
  echo "Usage: $0 [-d]"
  exit 1 # Exit with an error code
fi