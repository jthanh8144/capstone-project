import Joi from 'joi'

export const envSchema = {
  NODE_ENV: Joi.string()
    .valid('local', 'development', 'production', 'staging')
    .default('development'),
  APP_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_LIFE: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_LIFE: Joi.string().required(),
  MINIO_USER: Joi.string().required(),
  MINIO_PASSWORD: Joi.string().required(),
  MINIO_HOST: Joi.string().required(),
  MINIO_PORT: Joi.string().required(),
  BUCKET_NAME: Joi.string().required(),
  BUCKET_REGION: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.string().required(),
  REDIS_PASS: Joi.string().required(),
  WORKER_EVENT: Joi.string().required(),
  WORKER_MAIL: Joi.string().required(),
}
