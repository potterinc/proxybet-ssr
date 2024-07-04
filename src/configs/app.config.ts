import { configDotenv } from 'dotenv';

// ONLY USE ENVIRONMENTAL VARIABLES ON DEVELOPMENT
if (process.env.NODE_ENV !== 'production')
  configDotenv();

// APP GLOBAL CONFIGURATIONS
const AppConfig = {
  server: {
    // DATABASE_URL: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ewriter.y9z37mo.mongodb.net/PROXYBET`,
    DATABASE_URL: 'mongodb://127.0.0.1:27017/PROXYBET',
    BASE_URL: process.env.BASE_URL,
    PORT: process.env.PORT || 8080
  },
  authorization: { KEY: String(process.env.JWT_KEY) }
}

export default AppConfig;