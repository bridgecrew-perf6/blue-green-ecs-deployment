# Tremend Stocks API

## Building the Docker image

The Dockerfile is based on the official Node.js Docker Image: node:16.2.0-stretch. Static files (folders img and css) are served by Express as well as the dynamic parts. The following details are required to understand the Dockerfile:

- envsubst is used to generate the config file from environment variables
- `npm ci --only=production` installs the dependencies declared in package.json (package-lock.json, to be more precise)
- The Express application listens on port 8080
- The Express application’s entry point is server.js and can be started with node server.js

## Start application

```bash
#Install deps
npm install
#Buld the application
docker-compose -f docker/docker-compose-local.yml up --build
#Create Dynamo table
node dynamo-test/create_dynamo_table.js
#Optional you can delete it
node dynamo-test/delete_dynamo_table.js
```

## Building the app

```bash
# intall apps modules
npm install
# install babel for building the app
npm install -g @babel/core @babel/cli
# build the application
npm run build
```

## Connect to test DynamoDB

 A simple and free tool like dynamodb-admin will be fit for the purpose.

``` bash
npm install -g dynamodb-admin

DYNAMO_ENDPOINT=http://localhost:8000 dynamodb-admin
```

Now visit <http://localhost:8001> on your web browser to access the dynamodb-admin GUI.

## Infrastructure

Under the `CloudFormation` directory you will find all resources that are needed to deploy the infrastructure.

You will need to create AWS CodeCommit repo. Probably you will need to update the repo name on CodePieline.

### IAM

Next step is to create the IAM roles. Use the `1_iam.yaml` file for that.

### DOMAIN

Please buy the domain. Deploy the `2_domains.yaml`. Update the NS entries to pont to the Route53 hosted zone.

### VPC

Use your own VPC setup here.

### DynamoDB

The `4_dynamo.yaml` will setup one simple DynamoDB table.

### ECS & CodePipeline resources

Initialy deploy the `5_code_deploy.yaml` with `DesiredCount` parameter to 0.

After the template is deployed, and the application is built, you can go manually on ECS Service and update deired count to `2` or more.

The application image is built after the service is created. That is the reason why you don't need to have any running tasks.
