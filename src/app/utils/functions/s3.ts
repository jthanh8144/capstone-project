import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import s3Client from '../../../shared/configs/s3.config'
import { environment } from '../../../shared/constants'

export const generatePresignedUrl = async (key: string, expiresIn = 3600) => {
  const command = new PutObjectCommand({
    ['Bucket']: environment.s3.bucketName,
    ['Key']: key,
  })
  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn })
  const url = new URL(presignedUrl)
  url.search = ''
  return { presignedUrl, fileUrl: url.toString() }
}
