import { configDotenv } from 'dotenv';

// ONLY USE ENVIRONMENTAL VARIABLES ON DEVELOPMENT
if (process.env.NODE_ENV !== 'production')
  configDotenv();

// APP GLOBAL CONFIGURATIONS
const AppConfig = {
  server: {
    db: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ewriter.y9z37mo.mongodb.net/PROXYBET`,
    // db: url: 'mongodb://127.0.0.1:27017/TalentManager'`,
    BASE_URL: process.env.BASE_URL,
    PORT: process.env.PORT || 8080
  }
}

export default AppConfig;