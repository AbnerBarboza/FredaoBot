export const configuration = () => {
  console.log(process.env.NODE_ENV);
  console.log(process.env.S3_ENDPOINT);
  return {
    NODE_ENV: process.env.NODE_ENV,
    aws: {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      endpoint: process.env.S3_ENDPOINT,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    },
  };
};
