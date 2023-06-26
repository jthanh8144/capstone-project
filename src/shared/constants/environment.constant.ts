export const environment = {
  env: process.env.NODE_ENV,
  port: +(process.env.APP_PORT ?? 0),
  host: process.env.APP_HOST,
  database: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
    accessTokenLife: process.env.ACCESS_TOKEN_LIFE || '1h',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
    refreshTokenLife: process.env.REFRESH_TOKEN_LIFE || '7d',
  },
  mail: {
    user: process.env.MAIL_USER,
  },
  minio: {
    user: process.env.MINIO_USER,
    password: process.env.MINIO_PASSWORD,
    host: process.env.MINIO_HOST,
    port: +(process.env.MINIO_PORT ?? 9000),
    bucketName: process.env.BUCKET_NAME || 'safe-talk',
    bucketRegion: process.env.BUCKET_REGION,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: +(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASS,
  },
  workerName: {
    event: process.env.WORKER_EVENT || 'event-queue',
    mail: process.env.WORKER_MAIL || 'mail-queue',
  },
  firebase: {
    projectId: process.env.PROJECT_ID,
    privateKeyId: process.env.PRIVATE_KEY_ID,
    privateKey: process.env.PRIVATE_KEY,
    clientEmail: process.env.CLIENT_EMAIL,
    clientId: process.env.CLIENT_ID,
    clientCertUrl: process.env.CLIENT_CERT_URL,
  },
}
