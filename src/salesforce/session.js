import logger from '../utils/logger.js';

/**
 * Session storage for Telegram users
 * Maps Telegram chat ID to Salesforce session ID
 */
const sessions = new Map();

/**
 * Session timeout in milliseconds (30 minutes)
 */
const SESSION_TIMEOUT = 30 * 60 * 1000;

/**
 * Session cleanup interval (5 minutes)
 */
const CLEANUP_INTERVAL = 5 * 60 * 1000;

/**
 * Session data structure
 */
class Session {
  constructor(chatId) {
    this.chatId = chatId;
    this.sessionId = null;
    this.lastActivity = Date.now();
    this.messageHistory = [];
  }

  updateActivity() {
    this.lastActivity = Date.now();
  }

  isExpired() {
    return Date.now() - this.lastActivity > SESSION_TIMEOUT;
  }

  addMessage(role, content) {
    this.messageHistory.push({
      role,
      content,
      timestamp: Date.now()
    });

    // Keep only last 20 messages
    if (this.messageHistory.length > 20) {
      this.messageHistory = this.messageHistory.slice(-20);
    }
  }
}

/**
 * Get or create session for a chat
 */
export function getSession(chatId) {
  if (!sessions.has(chatId)) {
    logger.info(`Creating new session for chat ${chatId}`);
    sessions.set(chatId, new Session(chatId));
  }

  const session = sessions.get(chatId);
  session.updateActivity();
  return session;
}

/**
 * Update session ID from Salesforce response
 */
export function updateSessionId(chatId, sessionId) {
  const session = getSession(chatId);
  session.sessionId = sessionId;
  logger.info(`Updated session ID for chat ${chatId}: ${sessionId}`);
}

/**
 * Clear session for a chat
 */
export function clearSession(chatId) {
  if (sessions.has(chatId)) {
    logger.info(`Clearing session for chat ${chatId}`);
    sessions.delete(chatId);
    return true;
  }
  return false;
}

/**
 * Get all active sessions count
 */
export function getActiveSessionsCount() {
  return sessions.size;
}

/**
 * Clean up expired sessions
 */
function cleanupExpiredSessions() {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [chatId, session] of sessions.entries()) {
    if (session.isExpired()) {
      sessions.delete(chatId);
      cleanedCount++;
      logger.info(`Cleaned up expired session for chat ${chatId}`);
    }
  }

  if (cleanedCount > 0) {
    logger.info(`Cleaned up ${cleanedCount} expired session(s)`);
  }
}

/**
 * Start periodic session cleanup
 */
export function startSessionCleanup() {
  setInterval(cleanupExpiredSessions, CLEANUP_INTERVAL);
  logger.info('Session cleanup task started');
}

export default {
  getSession,
  updateSessionId,
  clearSession,
  getActiveSessionsCount,
  startSessionCleanup
};
