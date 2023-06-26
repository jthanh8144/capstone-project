import { Client } from 'minio'
import { environment } from '../constants'

const minioClient = new Client({
  endPoint: environment.minio.host,
  port: environment.minio.port,
  useSSL: false,
  accessKey: environment.minio.user,
  secretKey: environment.minio.password,
})

export default minioClient
