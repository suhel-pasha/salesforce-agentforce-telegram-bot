# Deployment Guide

This guide will help you deploy the Salesforce Agentforce Telegram Bot to various platforms.

## Prerequisites

Before deploying, ensure you have:

1. ✅ Salesforce org with Agentforce agent configured
2. ✅ Salesforce Connected App created
3. ✅ Telegram bot created via @BotFather
4. ✅ All environment variables ready

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials
# Use your favorite text editor
```

### 3. Deploy Salesforce Components

```bash
# Deploy the Apex REST API to Salesforce
sf project deploy start --source-dir salesforce/
```

### 4. Run Locally

```bash
# Start the bot
npm start

# Or use development mode with auto-reload
npm run dev
```

## Production Deployment

### Option 1: Heroku

#### Step 1: Install Heroku CLI

Download from: https://devcenter.heroku.com/articles/heroku-cli

#### Step 2: Login and Create App

```bash
heroku login
heroku create your-agentforce-bot
```

#### Step 3: Set Environment Variables

```bash
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set SF_LOGIN_URL=https://login.salesforce.com
heroku config:set SF_CLIENT_ID=your_client_id
heroku config:set SF_CLIENT_SECRET=your_client_secret
heroku config:set SF_USERNAME=your_username
heroku config:set SF_PASSWORD=your_password
heroku config:set SF_SECURITY_TOKEN=your_token
heroku config:set AGENTFORCE_AGENT_NAME=your_agent_name
heroku config:set NODE_ENV=production
```

#### Step 4: Deploy

```bash
git push heroku main
```

#### Step 5: Check Logs

```bash
heroku logs --tail
```

### Option 2: Railway

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

#### Step 2: Login and Initialize

```bash
railway login
railway init
```

#### Step 3: Add Environment Variables

1. Go to Railway dashboard
2. Select your project
3. Go to Variables tab
4. Add all environment variables from `.env.example`

#### Step 4: Deploy

```bash
railway up
```

### Option 3: Render

#### Step 1: Create Account

Sign up at: https://render.com

#### Step 2: Create New Web Service

1. Connect your GitHub repository
2. Select "Node" as environment
3. Set build command: `npm install`
4. Set start command: `npm start`

#### Step 3: Add Environment Variables

Add all variables from `.env.example` in the Environment tab

#### Step 4: Deploy

Render will automatically deploy when you push to GitHub

### Option 4: DigitalOcean App Platform

#### Step 1: Create App

1. Go to DigitalOcean App Platform
2. Create new app from GitHub repository

#### Step 2: Configure

- **Environment:** Node.js
- **Build Command:** `npm install`
- **Run Command:** `npm start`

#### Step 3: Add Environment Variables

Add all variables in the App Settings

#### Step 4: Deploy

App Platform will build and deploy automatically

### Option 5: AWS EC2

#### Step 1: Launch EC2 Instance

1. Choose Ubuntu Server 22.04 LTS
2. Select instance type (t2.micro for testing)
3. Configure security group (allow port 3000)

#### Step 2: Connect and Setup

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

#### Step 3: Deploy Application

```bash
# Clone repository
git clone your-repo-url
cd crimson-meteor

# Install dependencies
npm install

# Create .env file
nano .env
# Paste your environment variables

# Start with PM2
pm2 start src/index.js --name agentforce-bot
pm2 save
pm2 startup
```

## Post-Deployment Checklist

After deploying, verify:

- [ ] Bot responds to `/start` command on Telegram
- [ ] Bot can send messages to Agentforce
- [ ] Health check endpoint is accessible: `https://your-app-url/health`
- [ ] Logs show successful Salesforce authentication
- [ ] No errors in application logs

## Monitoring

### Check Application Health

```bash
# For Heroku
heroku logs --tail

# For Railway
railway logs

# For PM2 (EC2)
pm2 logs agentforce-bot
```

### Health Check Endpoint

Visit: `https://your-app-url/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-21T...",
  "uptime": 12345
}
```

## Troubleshooting

### Bot Not Responding

1. Check logs for errors
2. Verify Telegram bot token is correct
3. Ensure polling is working (check for polling errors)

### Salesforce Connection Issues

1. Verify Connected App credentials
2. Check IP restrictions in Salesforce
3. Ensure security token is current
4. Test Salesforce authentication separately

### Deployment Failures

1. Check Node.js version (must be 18+)
2. Verify all environment variables are set
3. Review build logs for errors
4. Ensure package.json is correct

## Scaling Considerations

For high-traffic scenarios:

1. **Use Redis for session storage** instead of in-memory
2. **Implement rate limiting** to prevent abuse
3. **Use load balancer** for multiple instances
4. **Monitor memory usage** and scale accordingly
5. **Implement caching** for frequently accessed data

## Security Best Practices

1. ✅ Never commit `.env` file
2. ✅ Use environment variables for all secrets
3. ✅ Enable HTTPS in production
4. ✅ Implement rate limiting
5. ✅ Regularly rotate credentials
6. ✅ Monitor for suspicious activity
7. ✅ Keep dependencies updated

## Updating the Application

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Restart the application
# For Heroku
git push heroku main

# For PM2
pm2 restart agentforce-bot
```

## Backup and Recovery

1. **Database:** Sessions are in-memory (consider Redis for persistence)
2. **Configuration:** Keep `.env.example` updated
3. **Code:** Use Git for version control
4. **Logs:** Archive logs regularly

## Support

For deployment issues:
- Check the main README.md
- Review application logs
- Open a GitHub issue
- Contact your DevOps team

---

Happy Deploying! 🚀
