import boto3
import gzip
import json
import logging

from google.cloud import bigquery


logger = logging.getLogger(__name__)

with open('./config.json') as f:
    config = json.loads(f.read())

s3_client = boto3.client('s3')


def lambda_handler(event, context):

    bq_client = bigquery.Client()
    dataset = bq_client.dataset(config['bqDataset'])
    table = dataset.table(config['bqTargetTable'])
    if 'testEvent' in event:
        table = dataset.table(config['bqTargetTable'] + "_test")
    table.reload()
    print("Received event: " + json.dumps(event, indent=2))
    s3_info = event['Records'][0]['s3']
    download_file_path = '/tmp/{}'.format(s3_info['object']['key'].replace('/', '-'))
    data = s3_client.download_file(s3_info['bucket']['name'],
                                   s3_info['object']['key'],
                                   download_file_path)
    with gzip.open(download_file_path, 'rt') as log_file:
        # Skip the first two lines of the file as they are headers
        next(log_file)
        next(log_file)
        bq_rows = []
        bq_row_ids = []
        batch_size = 1000
        for line in log_file:
            bq_row = line.split('\t')
            bw_row = [ field if field != '-' else None for field in bq_row ]
            bq_row = [str(bq_row[0] + " " + bq_row[1])] + bq_row[2:]
            bq_rows.append(bq_row)
            bq_row_ids.append(bq_row[13])
            if len(bq_rows) >= batch_size:
                errors = table.insert_data(rows=bq_rows, row_ids=bq_row_ids)
                if errors:
                    raise Exception("Function failed with errors: " + errors)
                    print(bq_rows[0])
                bq_rows = []
        if len(bq_rows) > 0:
            errors = table.insert_data(rows=bq_rows, row_ids=bq_row_ids)
            if errors:
                raise Exception("Function failed with errors: " + errors)
                print(bq_rows[0])
