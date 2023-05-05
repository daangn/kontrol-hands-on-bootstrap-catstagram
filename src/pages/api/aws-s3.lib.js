const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
 
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET
const AWS_REGION = process.env.AWS_REGION
const AWS_S3_ENDPOINT = process.env.AWS_S3_ENDPOINT
 
const client = new S3Client({
  region: AWS_REGION,
  endpoint: AWS_S3_ENDPOINT,
  forcePathStyle: AWS_REGION === 'minio',
})

const clientForPresignedUrl = new S3Client({
  region: AWS_REGION,
  endpoint: AWS_REGION === 'minio' ? 'http://localhost:9000' : undefined,
  forcePathStyle: AWS_REGION === 'minio',
})
 
const uploadImageToS3 = (buffer, key) => {
  return client.send(new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: 'image/jpeg',
  }))
}
 
const listS3Objects = (prefix) => {
  return client.send(new ListObjectsV2Command({
    Bucket: AWS_S3_BUCKET,
    Prefix: prefix,
  }))
}
 
const getSignedImageUrl = (key) => {
  return getSignedUrl(clientForPresignedUrl, new GetObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
  }))
}
 
module.exports = {
  uploadImageToS3,
  listS3Objects,
  getSignedImageUrl,
}