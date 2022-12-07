import os
import io
import boto3
import json
import csv

# grab environment variables
ENDPOINT_NAME = os.environ['ENDPOINT_NAME']
runtime = boto3.client('runtime.sagemaker')


def handler(event, context):
    # print("Received event: " + json.dumps(event, indent=2))

    data = json.loads(json.dumps(event))

    jsonFile = json.dumps({"inputs": data["body"]})
    print(jsonFile)

    response = runtime.invoke_endpoint(EndpointName=ENDPOINT_NAME,ContentType='application/json',Body=jsonFile)
    # print(response)
    # print("success?")
    result = json.loads(response['Body'].read().decode())
    print(result)
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        "body": json.dumps({"data": result})
    }
    # return predicted_label
