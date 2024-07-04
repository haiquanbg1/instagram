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

module.exports = {
    upload
}

