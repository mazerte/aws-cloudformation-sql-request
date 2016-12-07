#!/bin/bash

node_modules/.bin/cfn-lambda zip --output deploy/archive.zip

echo "Deploy $TRAVIS_TAG version to S3"
aws s3 cp deploy/archive.zip s3://chatanoo-deployments-eu-west-1/aws-cloudformation-sql-request/$TRAVIS_TAG.zip

echo "Upload latest"
aws s3api put-object \
  --bucket chatanoo-deployments-eu-west-1 \
  --key aws-cloudformation-sql-request/latest.zip \
  --website-redirect-location /chatanoo-deployments-eu-west-1/aws-cloudformation-sql-request/$TRAVIS_TAG.zip
