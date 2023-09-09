import { Construct } from 'constructs';
import { Stack, StackProps, RemovalPolicy} from 'aws-cdk-lib'
import { Repository } from 'aws-cdk-lib/aws-ecr'
import { Cluster, FargateService, FargateTaskDefinition, FargatePlatformVersion } from 'aws-cdk-lib/aws-ecs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';


interface AwsEcrEcsWorkerStackProps extends StackProps {
    ecrLogicalId: string;
    repositoryNameValue: string;
    clusterLogicalId: string;
    clusterNameValue: string;
}

export class AwsEcrEcsWorkerStack extends Stack {
  constructor(scope: Construct, id: string, props: AwsEcrEcsWorkerStackProps) {
    super(scope, id, props);

    const { ecrLogicalId, repositoryNameValue, clusterLogicalId, clusterNameValue } = props;

    const repository = new Repository(this, ecrLogicalId, {
      repositoryName: `${repositoryNameValue}`,
      removalPolicy: RemovalPolicy.DESTROY,
      imageScanOnPush: true
    });

    const vpc = Vpc.fromLookup(this, 'DefaultVpc', {
      isDefault: true, // This flag specifies that you want the default VPC
    });

    const cluster = new Cluster(this, clusterLogicalId, {
      vpc: vpc,
      clusterName: clusterNameValue
    });

    cluster.node.addDependency(cluster);

    const taskDefinition = new FargateTaskDefinition(this, 'MyTaskDefinition', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    // Create a Fargate service
    const fargateService = new FargateService(this, 'MyFargateService', {
      cluster: cluster,
      taskDefinition: taskDefinition, // Pass the task definition
      platformVersion: FargatePlatformVersion.LATEST, // Or specify a different platform version
    });

  }

}
