import TelegramBot from 'node-telegram-bot-api';
import config from '../utils/config.js';
import logger from '../utils/logger.js';
import { handleMessage, handleStart, handleHelp, handleReset } from './handlers.js';

/**
 * Telegram bot instance
 */
let bot = null;

/**
 * Initialize and start the Telegram bot
 */
export function initializeBot() {
  try {
    logger.info('Initializing Telegram bot...');

    bot = new TelegramBot(config.telegram.botToken, {
      polling: config.telegram.polling
    });

    // Register command handlers
    bot.onText(/\/start/, handleStart);
    bot.onText(/\/help/, handleHelp);
    bot.onText(/\/reset/, handleReset);

    // Handle all text messages (except commands)
    bot.on('message', async (msg) => {
      // Skip if it's a command
      if (msg.text && msg.text.startsWith('/')) {
        return;
      }

      await handleMessage(bot, msg);
    });

    // Error handling
    bot.on('polling_error', (error) => {
      logger.error('Telegram polling error:', error);
    });

    bot.on('error', (error) => {
      logger.error('Telegram bot error:', error);
    });

    logger.info('Telegram bot initialized successfully');
    logger.info('Bot is now listening for messages...');

    return bot;

  } catch (error) {
    logger.error('Failed to initialize Telegram bot:', error);
    throw error;
  }
}

/**
 * Get bot instance
 */
export function getBot() {
  if (!bot) {
    throw new Error('Bot not initialized. Call initializeBot() first.');
  }
  return bot;
}

/**
 * Stop the bot
 */
export async function stopBot() {
  if (bot) {
    logger.info('Stopping Telegram bot...');
    await bot.stopPolling();
    bot = null;
    logger.info('Telegram bot stopped');
  }
}

/**
 * Send typing action to show bot is processing
 */
export async function sendTypingAction(chatId) {
  if (bot) {
    await bot.sendChatAction(chatId, 'typing');
  }
}

/**
 * Send message with markdown formatting
 */
export async function sendFormattedMessage(chatId, text, options = {}) {
  if (bot) {
    return bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
      ...options
    });
  }
}

export default {
  initializeBot,
  getBot,
  stopBot,
  sendTypingAction,
  sendFormattedMessage
};
