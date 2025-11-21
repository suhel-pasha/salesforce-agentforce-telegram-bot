import express from 'express';
import { validateConfig } from './utils/config.js';
import logger from './utils/logger.js';
import { authenticate } from './salesforce/auth.js';
import { startSessionCleanup } from './salesforce/session.js';
import { initializeBot } from './bot/telegram.js';
import config from './utils/config.js';

/**
 * Main application entry point
 */
async function main() {
  try {
    logger.info('='.repeat(60));
    logger.info('Starting Salesforce Agentforce Telegram Bot');
    logger.info('='.repeat(60));

    // Validate configuration
    logger.info('Validating configuration...');
    validateConfig();
    logger.info('✓ Configuration validated');

    // Authenticate with Salesforce
    logger.info('Authenticating with Salesforce...');
    await authenticate();
    logger.info('✓ Salesforce authentication successful');

    // Start session cleanup task
    logger.info('Starting session cleanup task...');
    startSessionCleanup();
    logger.info('✓ Session cleanup task started');

    // Initialize Telegram bot
    logger.info('Initializing Telegram bot...');
    initializeBot();
    logger.info('✓ Telegram bot initialized');

    // Create Express server for health checks
    const app = express();
    
    app.use(express.json());

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // Status endpoint
    app.get('/status', (req, res) => {
      res.json({
        status: 'running',
        environment: config.server.env,
        salesforce: {
          connected: true,
          agentName: config.agentforce.agentName
        },
        telegram: {
          active: true
        }
      });
    });

    // Start Express server
    const port = config.server.port;
    app.listen(port, () => {
      logger.info(`✓ Health check server listening on port ${port}`);
    });

    logger.info('='.repeat(60));
    logger.info('🚀 Bot is now running and ready to receive messages!');
    logger.info('='.repeat(60));

  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
async function shutdown(signal) {
  logger.info(`\nReceived ${signal}, shutting down gracefully...`);
  
  try {
    // Stop the bot
    const { stopBot } = await import('./bot/telegram.js');
    await stopBot();
    
    logger.info('Shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
}

// Register shutdown handlers
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the application
main();
