# Deployment Guide

## 1. Structure
This folder contains the Docker configuration to containerize the entire portfolio.

- `docker-compose.yml`: Orchestrates all services.
- `*.Dockerfile`: Build instructions for each service.
- `nginx.conf`: Configuration for the frontend web server and reverse proxy.

## 2. Prerequisites
- Docker & Docker Compose installed.
- For external services (Chatbot, Stock), you need to have the repositories available or move them inside this repository.

## 3. How to Run
From the `deployment/` directory:

```bash
docker-compose up --build -d
```

The site will be available at `http://localhost` (port 80).

## 4. External Services Integration
The `docker-compose.yml` has commented-out sections for `chatbot-service` and `stock-service`.
Since these are in external repositories, you have two options:

1. **Move them inside:** Copy the folders into `server/` and create Dockerfiles for them similar to `sudoku.Dockerfile`.
2. **Adjust Context:** If running locally, you can point the `build: context` to the relative path of those repos, but this is harder to manage for a standalone deployment.

## 5. Kubernetes (Next Steps)
To move to K8s:
1. Build and push these images to a registry (Docker Hub / GHCR).
2. Create K8s Deployment and Service manifests for each service defined in `docker-compose.yml`.
3. Use an Ingress Controller (like Nginx Ingress) to handle the routing logic currently in `nginx.conf`.
