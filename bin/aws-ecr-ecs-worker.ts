#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsEcrEcsWorkerStack } from '../lib/aws-ecr-ecs-worker-stack';

const ecrLogicalId = "EcrWorkerLogicalId";
const repositoryNameValue = "ecr-worker";
const clusterLogicalId = "EcsClusterWorker";
const clusterNameValue = "cluster-worker"


const app = new cdk.App();
new AwsEcrEcsWorkerStack(app, 'AwsEcrEcsWorkerStack', { 
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
  ecrLogicalId,
  repositoryNameValue,
  clusterLogicalId,
  clusterNameValue
});