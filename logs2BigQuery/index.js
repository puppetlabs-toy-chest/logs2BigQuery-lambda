
var bigquery = require('@google-cloud/bigquery')();
var AWS = require('aws-sdk');
var zlib = require('zlib');


function parseLogLine(logLine) {
    logFields = logLine.split('\t');
    parsedLogLine = {
        "date": logFields[0],
        "time": logFields[1],
        "x-edge-location": logFields[2],
        "sc-bytes": logFields[3],
        "c-ip": logFields[4],
        "cs-method": logFields[5],
        "cs-host": logFields[6],
        "cs-uri-stem": logFields[7],
        "sc-status": logFields[8],
        "cs-referer": logFields[9],
        "cs-user-agent": logFields[10],
        "cs-uri-query": logFields[11],
        "cs-cookie": logFields[12],
        "x-edge-result-type": logFields[13],
        "x-edge-request-id": logFields[14],
        "x-host-header": logFields[15],
        "cs-protocol": logFields[16],
        "cs-bytes": logFields[17],
        "time-taken": logFields[18],
        "x-forwarded-for": logFields[19],
        "ssl-protocol": logFields[20],
        "ssl-cipher": logFields[21],
        "x-edge-response-result-type": logFields[22],
        "cs-protocol-version": logFields[23]
    }
    console.log(parsedLogLine);
}

function processObject(err, data) {
    if (err) {
        console.log(err);
    }
    const buff = Buffer.from(data.Body);
    zlib.unzip(buff, (err, buff) => {
        if (!err) {
            logLines = buff.toString().split('\n');
            for (var line in logLines) {
                parseLogLine(line);
            }
        }
    })
};

exports.handler = (event, context, callback) => {
    var s3 =  new AWS.S3();
    console.log(JSON.stringify(event));
    s3Info = event.Records[0].s3
    var params = {
       Bucket: s3Info.bucket.name,
       Key: s3Info.object.key
    }
    s3.getObject(params, processObject);
    callback(null, 'Hello from Lambda');
};
