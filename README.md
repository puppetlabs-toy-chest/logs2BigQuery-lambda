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
