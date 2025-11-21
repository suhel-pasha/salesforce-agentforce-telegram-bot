import { sendMessageToAgent } from '../salesforce/agentforce.js';
import { clearSession, getSession } from '../salesforce/session.js';
import { sendTypingAction, sendFormattedMessage } from './telegram.js';
import logger from '../utils/logger.js';

/**
 * Handle /start command
 */
export async function handleStart(msg) {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'there';

  logger.info(`User ${chatId} started the bot`);

  const welcomeMessage = `
🤖 *Welcome to Salesforce Agentforce Bot!*

Hello ${firstName}! 👋

I'm powered by Salesforce Agentforce, an intelligent AI agent that can help you with various tasks.

*How to use:*
• Just send me a message and I'll respond
• Use /help to see available commands
• Use /reset to start a new conversation

Let's get started! What can I help you with today?
  `.trim();

  await sendFormattedMessage(chatId, welcomeMessage);
}

/**
 * Handle /help command
 */
export async function handleHelp(msg) {
  const chatId = msg.chat.id;

  logger.info(`User ${chatId} requested help`);

  const helpMessage = `
📚 *Available Commands*

/start - Start the bot and see welcome message
/help - Show this help message
/reset - Reset conversation and start fresh

*Tips:*
• I maintain conversation context, so you can have natural conversations
• Sessions expire after 30 minutes of inactivity
• If you encounter any issues, try /reset

*Example questions you can ask:*
• "What can you help me with?"
• "Tell me about your capabilities"
• Or anything else you'd like to know!

Need assistance? Just send me a message! 💬
  `.trim();

  await sendFormattedMessage(chatId, helpMessage);
}

/**
 * Handle /reset command
 */
export async function handleReset(msg) {
  const chatId = msg.chat.id;

  logger.info(`User ${chatId} requested session reset`);

  const wasCleared = clearSession(chatId);

  const resetMessage = wasCleared
    ? '✅ *Session Reset*\n\nYour conversation has been reset. Let\'s start fresh! What would you like to talk about?'
    : '✅ *Session Reset*\n\nReady for a new conversation! What can I help you with?';

  await sendFormattedMessage(chatId, resetMessage);
}

/**
 * Handle regular text messages
 */
export async function handleMessage(bot, msg) {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  // Ignore empty messages
  if (!messageText || messageText.trim() === '') {
    return;
  }

  logger.info(`Received message from ${chatId}: "${messageText}"`);

  try {
    // Show typing indicator
    await sendTypingAction(chatId);

    // Get session info for logging
    const session = getSession(chatId);
    logger.debug(`Session info - ID: ${session.sessionId}, Messages: ${session.messageHistory.length}`);

    // Send message to Agentforce and get response
    const response = await sendMessageToAgent(chatId, messageText);

    // Send response back to user
    await bot.sendMessage(chatId, response);

    logger.info(`Sent response to ${chatId}`);

  } catch (error) {
    logger.error(`Error handling message from ${chatId}:`, error);

    // Send error message to user
    const errorMessage = `
❌ *Oops! Something went wrong*

I encountered an error while processing your message. Please try again.

If the problem persists, try:
• /reset - Reset your conversation
• Wait a moment and try again

Error: ${error.message}
    `.trim();

    await sendFormattedMessage(chatId, errorMessage);
  }
}

/**
 * Handle callback queries (for inline keyboards if needed in future)
 */
export async function handleCallbackQuery(bot, query) {
  const chatId = query.message.chat.id;
  const data = query.data;

  logger.info(`Received callback query from ${chatId}: ${data}`);

  // Answer callback query to remove loading state
  await bot.answerCallbackQuery(query.id);

  // Handle different callback actions
  switch (data) {
    case 'reset':
      await handleReset(query.message);
      break;
    case 'help':
      await handleHelp(query.message);
      break;
    default:
      logger.warn(`Unknown callback query data: ${data}`);
  }
}

export default {
  handleStart,
  handleHelp,
  handleReset,
  handleMessage,
  handleCallbackQuery
};
