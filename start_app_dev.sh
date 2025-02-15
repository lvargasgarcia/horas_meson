#!/bin/bash

# Determine if detached mode (-d) should be used
if [[ "$1" == "-d" ]]; then
  docker compose -f compose-dev.yaml up -d
elif [[ -z "$1" ]]; then #if no argument was passed
    docker compose -f compose-dev.yaml up 
else
  echo "Invalid argument: $1"
  echo "Usage: $0 [-d]"
  exit 1 # Exit with an error code
fi