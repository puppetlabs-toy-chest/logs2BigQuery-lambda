# logs2BigQuery-lambda
An AWS lambda function to process AWS CloudFront logs and write them in to Google BigQuery. The function is primarily triggered
when CloudFront creates an s3 object. CloudFront will periodically create objects several times in an hour containing all the
log data for that time period.

# Configuration
The lambda function handler is configured with a JSON file that gets baked in to the zip file during the build process.
To create a new configuration for the lambda copy config.example.json to config.json and edit the file with the appropriate data.
```
cp config.example.json config.json
```

The Lambda will also require GCP service account credentials so it can write data into BigQuery. If this is a first time setup then a service account must be created in
the appropriate GCP project. Follow [this](https://cloud.google.com/iam/docs/service-accounts) guide on how to create service accounts in GCP. Once created, it should
have the role "BigQuery Data Editor". The JSON credentials should be placed in the build directory so they get built into the Lambda. The environment variable
`GOOGLE_APPLICATION_CREDENTIALS` should contain the value of the path where the credentials are stored. Follow [this](http://docs.aws.amazon.com/lambda/latest/dg/env_variables.html)
guide for information on how to configure a Lambda functions environment variables.

# Building
Create a virtualenv in the project directory and run the build script. It will produce as zip file that you will then upload to AWS.
```
python3 -m venv .
mkdir build
./build.sh
```

# Upload to AWS
This step assumes you have the aws cli configured and you have the correct access policy in place to use the AWS lambda service.
Run the following command to upload the lambda function to AWS.
```
aws lambda update-function-code --zip-file fileb://$PWD/logs2BigQuery-lambda.zip --function-name logs2BigQuery
```

# Basic Testing

The Lambda has a test event configured which will simulate the event that triggers the Lambda. This test event is modified so that the Lambda will write log data to a test table.
