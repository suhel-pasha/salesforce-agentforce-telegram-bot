# Salesforce Apex Components

This directory contains Salesforce Apex classes that need to be deployed to your Salesforce org.

## Files

### AgentforceChatAPI.cls
REST API endpoint that the Telegram bot calls to communicate with your Agentforce agent.

**Endpoint:** `/services/apexrest/agentforce/chat`

**Methods:**
- `POST /agentforce/chat` - Send a message to the agent
- `GET /agentforce/chat` - Check API status

## Deployment Instructions

### Option 1: Using Salesforce CLI (Recommended)

```bash
# Authenticate with your org (if not already done)
sf org login web

# Deploy the Apex class
sf project deploy start --source-dir salesforce/
```

### Option 2: Using Developer Console

1. Open Developer Console in Salesforce
2. File → New → Apex Class
3. Name it `AgentforceChatAPI`
4. Copy the contents from `AgentforceChatAPI.cls`
5. Save

### Option 3: Using VS Code with Salesforce Extension

1. Open VS Code with Salesforce Extension Pack installed
2. Right-click on the `salesforce` folder
3. Select "SFDX: Deploy Source to Org"

## Testing the API

After deployment, you can test the API using the following Apex code in Developer Console:

```apex
// Test the REST API
RestRequest req = new RestRequest();
req.requestURI = '/services/apexrest/agentforce/chat';
req.httpMethod = 'POST';
req.requestBody = Blob.valueOf('{"agentName":"YourAgentName","message":"Hello"}');

RestContext.request = req;
RestContext.response = new RestResponse();

AgentforceChatAPI.ChatResponse response = AgentforceChatAPI.sendMessage();
System.debug('Response: ' + JSON.serialize(response));
```

## Required Permissions

Ensure the user/integration user has:
- API Enabled permission
- Access to Agentforce agents
- Execute Apex REST services permission

## Notes

- The API uses Invocable Actions to communicate with Agentforce
- Session management is handled automatically
- Error handling is built-in with user-friendly messages
