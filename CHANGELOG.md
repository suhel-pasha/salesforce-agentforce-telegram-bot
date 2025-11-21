# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-21

### Added
- Initial release of Salesforce Agentforce Telegram Bot
- Telegram bot integration with node-telegram-bot-api
- Salesforce authentication using jsforce
- Agentforce agent communication via REST API
- Session management for conversation context
- Comprehensive logging with Winston
- Health check endpoints
- Support for multiple deployment platforms (Heroku, Railway, Render, AWS, DigitalOcean)
- Detailed documentation (README, QUICKSTART, DEPLOYMENT, CONTRIBUTING)
- Salesforce Apex REST API endpoint
- Environment-based configuration
- Graceful shutdown handling
- Error handling and user-friendly error messages
- Command handlers (/start, /help, /reset)
- Session cleanup task
- MIT License

### Features
- Real-time message handling
- Conversation context maintenance
- Session expiration (30 minutes)
- Typing indicators
- Markdown message formatting
- Multiple Agentforce integration approaches (REST API and Invocable Actions)

### Documentation
- Comprehensive README with architecture overview
- Quick start guide for easy setup
- Detailed deployment guide for multiple platforms
- Contributing guidelines
- Salesforce component documentation
- Environment variable templates

### Developer Experience
- ES6+ module support
- Structured project organization
- Configurable logging levels
- Development mode with auto-reload
- Health check and status endpoints
- Extensive error handling

[1.0.0]: https://github.com/suhel-pasha/salesforce-agentforce-telegram-bot/releases/tag/v1.0.0
