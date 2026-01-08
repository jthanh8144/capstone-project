import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3'

import { environment } from '../constants'

const s3ClientConfig: S3ClientConfig = {
  region: environment.s3.region,
  credentials: {
    accessKeyId: environment.s3.accessKeyId,
    secretAccessKey: environment.s3.secretAccessKey,
  },
}
if (environment.s3.endpoint) {
  s3ClientConfig.endpoint = environment.s3.endpoint
  s3ClientConfig.forcePathStyle = true
}
const s3Client = new S3Client(s3ClientConfig)

export default s3Client
