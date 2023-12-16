import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod'),

  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  S3_ENDPOINT: Joi.string().optional(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_USERNAME: Joi.string().optional().allow(''),
  REDIS_PASSWORD: Joi.string().required(),
});
