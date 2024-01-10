#!/bin/bash

# Set the WSL port and host port
wsl_port=3000
host_port=3000

# Check if the required utility is installed
if ! command -v socat > /dev/null; then
  echo "socat is not installed. Please install it first."
  exit 1
fi

# Forward the port from WSL to the host
socat TCP-LISTEN:$wsl_port,reuseaddr,fork TCP:localhost:$host_port &

echo "Port $wsl_port forwarded to host port $host_port."

