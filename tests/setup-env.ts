process.env.NODE_ENV = 'test';
process.env.TOKEN_KEY = 'test-secret-key-for-jest';
process.env.DATABASE_URL = 'file:./test.db';
process.env.OTP_DEV_MODE = 'true';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.OTP_TTL_SECONDS = '300';
