# Salesforce Agentforce Telegram Bot

A powerful integration that connects Salesforce Agentforce agents with Telegram, enabling intelligent conversational AI experiences directly in Telegram chats.

## 🚀 Features

- **Seamless Agentforce Integration**: Connect your Salesforce Agentforce agents to Telegram
- **Real-time Conversations**: Instant message handling with session management
- **Secure Authentication**: OAuth 2.0 integration with Salesforce
- **Scalable Architecture**: Built with Node.js and Express for production deployment
- **Easy Deployment**: Ready for deployment on Heroku, Railway, or any Node.js hosting platform

## 📋 Prerequisites

- Node.js 18+ installed
- Salesforce org with Agentforce agent configured
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- Salesforce Connected App credentials

## 🛠️ Setup Instructions

### 1. Salesforce Configuration

1. **Create a Connected App** in Salesforce:
   - Go to Setup → App Manager → New Connected App
   - Enable OAuth Settings
   - Add callback URL: `http://localhost:3000/oauth/callback`
   - Select OAuth Scopes: `api`, `refresh_token`, `offline_access`
   - Save and note the Consumer Key and Consumer Secret

2. **Configure Agentforce Agent**:
   - Ensure your Agentforce agent is active
   - Note the Agent API Name

### 2. Telegram Bot Setup

1. Create a new bot with [@BotFather](https://t.me/botfather)
2. Use `/newbot` command and follow instructions
3. Save the Bot Token provided

### 3. Local Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd crimson-meteor

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Start the bot
npm start
```

### 4. Environment Variables

Create a `.env` file with the following:

```env
# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Salesforce Configuration
SF_LOGIN_URL=https://login.salesforce.com
SF_CLIENT_ID=your_connected_app_consumer_key
SF_CLIENT_SECRET=your_connected_app_consumer_secret
SF_USERNAME=your_salesforce_username
SF_PASSWORD=your_salesforce_password
SF_SECURITY_TOKEN=your_security_token

# Agentforce Configuration
AGENTFORCE_AGENT_NAME=your_agent_api_name

# Server Configuration
PORT=3000
NODE_ENV=production
```

## 🎯 Usage

1. Start a conversation with your bot on Telegram
2. Send any message to interact with your Agentforce agent
3. The bot will maintain conversation context across messages

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Telegram  │ ───> │  Node.js Bot │ ───> │   Salesforce    │
│    User     │ <─── │   (Express)  │ <─── │  Agentforce API │
└─────────────┘      └──────────────┘      └─────────────────┘
```

## 📁 Project Structure

```
crimson-meteor/
├── src/
│   ├── bot/
│   │   ├── telegram.js       # Telegram bot logic
│   │   └── handlers.js       # Message handlers
│   ├── salesforce/
│   │   ├── auth.js           # Salesforce authentication
│   │   ├── agentforce.js     # Agentforce API integration
│   │   └── session.js        # Session management
│   ├── utils/
│   │   ├── logger.js         # Logging utility
│   │   └── config.js         # Configuration management
│   └── index.js              # Application entry point
├── tests/
│   └── integration.test.js   # Integration tests
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Deployment

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Set environment variables
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set SF_CLIENT_ID=your_client_id
# ... set all other variables

# Deploy
git push heroku main
```

### Deploy to Railway

1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically on push

## 🔒 Security Best Practices

- Never commit `.env` file or credentials
- Use environment variables for all sensitive data
- Rotate Salesforce security tokens regularly
- Monitor bot usage and implement rate limiting
- Use HTTPS for production deployments

## 🐛 Troubleshooting

### Bot not responding
- Verify Telegram bot token is correct
- Check bot is started: `npm start`
- Review logs for errors

### Salesforce authentication errors
- Verify Connected App credentials
- Check IP restrictions in Salesforce
- Ensure security token is current

### Agentforce not responding
- Verify agent is active in Salesforce
- Check agent API name is correct
- Review Salesforce debug logs

## 📝 License

MIT License - feel free to use this project for your own purposes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open a GitHub issue.

---

Built with ❤️ using Salesforce Agentforce and Telegram Bot API
