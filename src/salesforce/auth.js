import jsforce from 'jsforce';
import config from '../utils/config.js';
import logger from '../utils/logger.js';

/**
 * Salesforce connection instance
 */
let connection = null;

/**
 * Authenticate with Salesforce using username-password flow
 */
export async function authenticate() {
  try {
    logger.info('Authenticating with Salesforce...');

    connection = new jsforce.Connection({
      loginUrl: config.salesforce.loginUrl,
      version: config.salesforce.apiVersion
    });

    const password = config.salesforce.password + (config.salesforce.securityToken || '');

    await connection.login(config.salesforce.username, password);

    logger.info('Successfully authenticated with Salesforce');
    logger.info(`Instance URL: ${connection.instanceUrl}`);
    logger.info(`Access Token: ${connection.accessToken ? '***' + connection.accessToken.slice(-4) : 'N/A'}`);

    return connection;
  } catch (error) {
    logger.error('Salesforce authentication failed:', error);
    throw error;
  }
}

/**
 * Get current Salesforce connection
 */
export function getConnection() {
  if (!connection) {
    throw new Error('Salesforce connection not initialized. Call authenticate() first.');
  }
  return connection;
}

/**
 * Check if connection is valid
 */
export async function isConnectionValid() {
  if (!connection) {
    return false;
  }

  try {
    await connection.identity();
    return true;
  } catch (error) {
    logger.warn('Connection validation failed:', error.message);
    return false;
  }
}

/**
 * Ensure connection is valid, re-authenticate if needed
 */
export async function ensureConnection() {
  const isValid = await isConnectionValid();
  
  if (!isValid) {
    logger.info('Connection invalid, re-authenticating...');
    await authenticate();
  }

  return connection;
}

export default {
  authenticate,
  getConnection,
  isConnectionValid,
  ensureConnection
};
