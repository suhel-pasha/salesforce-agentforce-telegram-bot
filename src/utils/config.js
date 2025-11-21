import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Application configuration
 */
const config = {
  // Telegram configuration
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    polling: {
      interval: 300,
      autoStart: true,
      params: {
        timeout: 10
      }
    }
  },

  // Salesforce configuration
  salesforce: {
    loginUrl: process.env.SF_LOGIN_URL || 'https://login.salesforce.com',
    clientId: process.env.SF_CLIENT_ID,
    clientSecret: process.env.SF_CLIENT_SECRET,
    username: process.env.SF_USERNAME,
    password: process.env.SF_PASSWORD,
    securityToken: process.env.SF_SECURITY_TOKEN,
    apiVersion: '60.0'
  },

  // Agentforce configuration
  agentforce: {
    agentName: process.env.AGENTFORCE_AGENT_NAME
  },

  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

/**
 * Validate required configuration
 */
export function validateConfig() {
  const required = [
    { key: 'telegram.botToken', value: config.telegram.botToken, name: 'TELEGRAM_BOT_TOKEN' },
    { key: 'salesforce.clientId', value: config.salesforce.clientId, name: 'SF_CLIENT_ID' },
    { key: 'salesforce.clientSecret', value: config.salesforce.clientSecret, name: 'SF_CLIENT_SECRET' },
    { key: 'salesforce.username', value: config.salesforce.username, name: 'SF_USERNAME' },
    { key: 'salesforce.password', value: config.salesforce.password, name: 'SF_PASSWORD' },
    { key: 'agentforce.agentName', value: config.agentforce.agentName, name: 'AGENTFORCE_AGENT_NAME' }
  ];

  const missing = required.filter(item => !item.value);

  if (missing.length > 0) {
    const missingVars = missing.map(item => item.name).join(', ');
    throw new Error(`Missing required environment variables: ${missingVars}`);
  }

  return true;
}

export default config;
