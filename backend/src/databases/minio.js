const Minio = require('minio');

// Khởi tạo MinIO client
const minioClient = new Minio.Client({
  endPoint: process.env.minio_endpoint,
  port: 9000,
  useSSL: false,
  accessKey: process.env.minio_accesskey,
  secretKey: process.env.minio_secretkey
});

const upload = async (bucketName, objectName, filePath) => {
    const checkBucketExists = await minioClient.bucketExists(bucketName);

    if (!checkBucketExists) {
        // Tạo một bucket mới
        await minioClient.makeBucket(bucketName, 'us-east-1', (err) => {
            if (err) return console.log('Error creating bucket.', err);
            console.log('Bucket created successfully.');
        });
    }

    // Tải lên một file
    await minioClient.fPutObject(bucketName, objectName, filePath, (err, etag) => {
        if (err) return console.log('Error uploading file.', err);
        console.log('File uploaded successfully.');
    });
}

const listObjectsAndUrls = (bucketName) => {
    return new Promise(async (resolve, reject) => {
        const images = [];

        const checkBucket = await minioClient.bucketExists(bucketName);
        if (!checkBucket) {
            return resolve(images);
        }

        try {
            const stream = minioClient.listObjectsV2(bucketName, '', true);
    
            stream.on('data', obj => {
                // Tạo URL tĩnh
                const url = `${minioClient.protocol}//${minioClient.host}:${minioClient.port}/${bucketName}/${obj.name}`;
                images.push(url);
                // console.log(`File: ${obj.name}, URL: ${url}`);
            });
    
            stream.on('error', err => {
                console.error(err);
                reject(err);
            });

            stream.on('end', () => {
                resolve(images);
            })
        } catch (error) {
            console.error('Error in listing objects: ', error);
            reject(error);
        }
    });
}

module.exports = {
    upload,
    listObjectsAndUrls
}

