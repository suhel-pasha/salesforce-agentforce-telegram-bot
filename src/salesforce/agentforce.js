import { ensureConnection } from './auth.js';
import { getSession, updateSessionId } from './session.js';
import config from '../utils/config.js';
import logger from '../utils/logger.js';

/**
 * Send a message to Agentforce agent and get response
 * 
 * @param {number} chatId - Telegram chat ID
 * @param {string} message - User message
 * @returns {Promise<string>} - Agent response
 */
export async function sendMessageToAgent(chatId, message) {
  try {
    const connection = await ensureConnection();
    const session = getSession(chatId);

    logger.info(`Sending message to Agentforce for chat ${chatId}: "${message}"`);

    // Prepare the request payload
    const payload = {
      agentName: config.agentforce.agentName,
      message: message,
      sessionId: session.sessionId || null
    };

    logger.debug('Agentforce request payload:', payload);

    // Call Agentforce API using Apex REST endpoint
    // This assumes you have an Apex REST endpoint set up
    const response = await connection.request({
      method: 'POST',
      url: `/services/apexrest/agentforce/chat`,
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    logger.debug('Agentforce response:', response);

    // Update session ID if provided in response
    if (response.sessionId) {
      updateSessionId(chatId, response.sessionId);
    }

    // Add message to session history
    session.addMessage('user', message);
    session.addMessage('agent', response.message);

    return response.message || 'I apologize, but I could not generate a response.';

  } catch (error) {
    logger.error('Error communicating with Agentforce:', error);
    
    // Provide user-friendly error messages
    if (error.message.includes('INVALID_SESSION_ID')) {
      // Clear session and retry
      const session = getSession(chatId);
      session.sessionId = null;
      logger.info('Session expired, retrying with new session...');
      return sendMessageToAgent(chatId, message);
    }

    throw new Error('Unable to process your request. Please try again later.');
  }
}

/**
 * Alternative implementation using Invocable Actions
 * This uses the standard Salesforce Invocable.Action API
 */
export async function sendMessageToAgentViaInvocable(chatId, message) {
  try {
    const connection = await ensureConnection();
    const session = getSession(chatId);

    logger.info(`Sending message to Agentforce via Invocable for chat ${chatId}`);

    // Prepare invocable action request
    const actionRequest = {
      inputs: [{
        agentName: config.agentforce.agentName,
        userMessage: message,
        sessionId: session.sessionId
      }]
    };

    // Call the Invocable Action
    const result = await connection.request({
      method: 'POST',
      url: `/services/data/v${config.salesforce.apiVersion}/actions/custom/flow/Agent_Chat`,
      body: JSON.stringify(actionRequest),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    logger.debug('Invocable action result:', result);

    if (result && result.length > 0) {
      const output = result[0];
      
      // Update session ID
      if (output.sessionId) {
        updateSessionId(chatId, output.sessionId);
      }

      // Add to history
      session.addMessage('user', message);
      session.addMessage('agent', output.responseMessage);

      return output.responseMessage;
    }

    throw new Error('No response from Agentforce');

  } catch (error) {
    logger.error('Error with Invocable action:', error);
    throw new Error('Unable to process your request. Please try again later.');
  }
}

/**
 * Get agent information
 */
export async function getAgentInfo() {
  try {
    const connection = await ensureConnection();
    
    // Query for agent information
    const result = await connection.query(
      `SELECT Id, DeveloperName, MasterLabel, Description 
       FROM BotDefinition 
       WHERE DeveloperName = '${config.agentforce.agentName}' 
       LIMIT 1`
    );

    if (result.records && result.records.length > 0) {
      return result.records[0];
    }

    return null;
  } catch (error) {
    logger.error('Error fetching agent info:', error);
    return null;
  }
}

export default {
  sendMessageToAgent,
  sendMessageToAgentViaInvocable,
  getAgentInfo
};
