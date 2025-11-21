# Quick Start Guide

Get your Salesforce Agentforce Telegram Bot up and running in minutes!

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] Salesforce org with Agentforce agent configured
- [ ] Telegram account
- [ ] Git installed
- [ ] GitHub account (for deployment)

## 🚀 5-Minute Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/suhel-pasha/salesforce-agentforce-telegram-bot.git
cd salesforce-agentforce-telegram-bot
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Your Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. **Save the Bot Token** - you'll need it in the next step

### Step 4: Set Up Salesforce Connected App

1. In Salesforce, go to **Setup** → **App Manager**
2. Click **New Connected App**
3. Fill in the basic information:
   - Connected App Name: `Telegram Bot Integration`
   - API Name: `Telegram_Bot_Integration`
   - Contact Email: your email
4. Enable **OAuth Settings**:
   - Callback URL: `http://localhost:3000/oauth/callback`
   - Selected OAuth Scopes:
     - Full access (full)
     - Perform requests at any time (refresh_token, offline_access)
5. Click **Save** and wait 2-10 minutes for changes to take effect
6. Click **Manage Consumer Details** to view:
   - **Consumer Key** (Client ID)
   - **Consumer Secret** (Client Secret)

### Step 5: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` file with your credentials:

```env
# Telegram Bot Token from Step 3
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Salesforce Connected App from Step 4
SF_CLIENT_ID=your_consumer_key_here
SF_CLIENT_SECRET=your_consumer_secret_here

# Your Salesforce credentials
SF_USERNAME=your_salesforce_username@example.com
SF_PASSWORD=your_salesforce_password
SF_SECURITY_TOKEN=your_security_token

# Your Agentforce Agent API Name
AGENTFORCE_AGENT_NAME=Your_Agent_API_Name
```

**How to get your Salesforce Security Token:**
1. In Salesforce, click your profile icon → Settings
2. My Personal Information → Reset My Security Token
3. Check your email for the new token

**How to find your Agent API Name:**
1. In Salesforce, go to Setup → Agents
2. Click on your agent
3. The API Name is shown in the details

### Step 6: Deploy Salesforce Apex Class

```bash
# Make sure you're authenticated with Salesforce CLI
sf org login web

# Deploy the Apex REST API
sf project deploy start --source-dir salesforce/
```

### Step 7: Start Your Bot!

```bash
npm start
```

You should see:
```
🚀 Bot is now running and ready to receive messages!
```

### Step 8: Test Your Bot

1. Open Telegram
2. Search for your bot (the username you created with BotFather)
3. Send `/start` to begin
4. Send a message to test the Agentforce integration!

## 🎉 Success!

Your bot is now running! Here are some next steps:

### Test Commands

- `/start` - Welcome message
- `/help` - Show available commands
- `/reset` - Reset conversation

### Deploy to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to:
- Heroku
- Railway
- Render
- AWS
- DigitalOcean

## 🔧 Troubleshooting

### Bot not responding?

1. Check if the bot is running: `npm start`
2. Verify your Telegram bot token is correct
3. Check the logs for errors

### Salesforce authentication failed?

1. Verify your username and password
2. Make sure security token is current
3. Check if your IP is whitelisted in Salesforce
4. Verify Connected App is approved

### Agent not responding?

1. Verify agent is active in Salesforce
2. Check agent API name is correct
3. Ensure Apex class is deployed
4. Review Salesforce debug logs

### Common Issues

**"Missing required environment variables"**
- Make sure all variables in `.env` are filled in
- Check for typos in variable names

**"Salesforce authentication failed"**
- Password should be: `password + security_token` (concatenated)
- Or set them separately as shown in `.env.example`

**"Agent not found"**
- Verify the agent API name (not the label)
- Check agent is active and published

## 📚 Additional Resources

- [Full Documentation](README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Salesforce Agentforce Docs](https://help.salesforce.com/s/articleView?id=sf.bots_service_intro.htm)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 💬 Need Help?

- Open an issue on [GitHub](https://github.com/suhel-pasha/salesforce-agentforce-telegram-bot/issues)
- Check existing issues for solutions
- Review the logs for error messages

---

Happy Botting! 🤖✨
