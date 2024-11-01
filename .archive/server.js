const express = require('express'), server = express()
const config = require('dotenv').config().parsed
const s3client = require('s3-client').createClient({
    maxAsyncS3: 20,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 20971520, // this is the default (20 MB)
    multipartUploadSize: 15728640, // this is the default (15 MB)
    s3Options: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET,
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
        sslEnabled: true
      // any other options are passed to new AWS.S3()
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    },
});
const log4js = require('log4js');
log4js.configure({
    appenders: { 
        logFile: { type: "file", filename: "logs.log" },
        logConsole: { type: "console" }
    },
    categories: { default: { appenders: ["logFile", "logConsole"], level: "debug" } },
});
const logger = log4js.getLogger("server");
logger.level = "debug";


server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/", express.static('public'));

server.get("/photo/:id?", async (req, res) => {
    logger.info("GET /photo");

    if (req.params.id) {
        s3client.s3.headObject({
            Bucket: process.env.S3_BUCKET,
            Key: req.params.id
        }, function(err, data) {
            if (err) { res.status(err.statusCode).json(err); return; }
            
            res.json({
                status: "OK",
                data: `https://${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${req.params.id}`
            });
        });
    } else {
        await s3client.s3.listObjects({
            Bucket: process.env.S3_BUCKET
        }, function(err, data) {
            if (err) { res.status(500).json(err); return; }
            
            const photoList = [];
    
            for (photo of data['Contents']) {
                photoList.push(`https://${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${photo['Key']}`);
            }
    
            res.json({
                status: "OK",
                data: photoList
            });
        });
    }
});

server.listen(config.PORT, async () => {
    logger.info(`listening on port ${config.PORT}`);
});

process.on('uncaughtException', err => {
    logger.error(err && err.stack);
});
