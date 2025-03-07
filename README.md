# Testcase Polkadot Metrics API

A Node.js API that collects on-chain metrics from the **Polkadot blockchain** using `@polkadot/api` and exposes them in **Prometheus-compatible** format. The API also provides **system performance metrics**.

## Features
**Polkadot Metrics** (`/metrics`): Current Era & Validator Reward Points.  
**API Status Endpoint** (`/status`): General API health info.  
**Simple API Performance Metrics**: CPU, Memory.  
**Grafana Dashboards** for visualization.  
**Terraform Infrastructure** with **AWS Auto Scaling & Load Balancer**.  
**CI/CD with GitHub Actions** for Docker build & push.  


## Running the API

### Prerequisites
- **Docker**

### Running with Docker

This repository comes with a docker-compose that will spin up a Grafana and Prometheus instance to run alongside the API.

```sh
docker-compose up --build -d
```

That will spin up:
- The API at
   - **Metrics:** [http://localhost:3000/metrics](http://localhost:3000/metrics)
   - **Status:** [http://localhost:3000/status](http://localhost:3000/status)
- Prometheus instance at [http://localhost:9090](http://localhost:9090)
- Grafana instance at [http://localhost:3001](http://localhost:3001)

To delete the docker stack and their associated volumes just run:

```sh
docker-compose down -v
```

---

## Deploying to AWS with Terraform

### Assumptions
Terraform scripts are assuming:
   - that there is a docker image publicly available to be run on the EC2 instance. That's why there is a very simple Github Action workflow to push the api to dockerhub.
   - A grafana and prometheus instance is already in place that will scrape the api /metrics endpoint
   - Is not production ready as it was just to test out the deployment of autoscaling groups for EC2 instances based on cloudwatch metrics
   - Are not the best way to deploy a container image onto an EC2 instance

The terraform folder was just to fiddle around a little bit with AWS AutoScaling Groups.

### Deploying to AWS
1. Configure variables in `terraform/variables.tf`
2. Deploy:
   ```sh
   terraform init
   terraform apply
   ```
3. Access API:
   ```sh
   curl http://your-loadbalancer.amazonaws.com/metrics
   ```

---

## Grafana Dashboards
1. **Go to Grafana** 
2. **Log in**
   Use admin/admin, after that you will be prompted to change your password.
3. **Navigate to dashboards**
   There you will find two dashboards:
      - Polkadot Metrics: Polkadot metrics
      - Api Metrics: API metrics



## Next steps

- Improving CI and adding CD
   - CI workflow has a lot of room for improvement, it doesn't use cache, no tests are performed.
   - CD should be configured to automatically deploy the API.
- Adding tests to the API code, static code analysis, docker image scanning, linting library.
- Improve developer experience, hot reloading of API changes on docker-compose, maybe devcontainers to homogenize developer environment.
- Improve AWS architecture, for instance adding a Bastion Host to reach EC2 instances on the private subnet.
