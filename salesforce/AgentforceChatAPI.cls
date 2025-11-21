@RestResource(urlMapping='/agentforce/chat')
global with sharing class AgentforceChatAPI {
    
    /**
     * Chat request wrapper
     */
    global class ChatRequest {
        public String agentName;
        public String message;
        public String sessionId;
    }
    
    /**
     * Chat response wrapper
     */
    global class ChatResponse {
        public String message;
        public String sessionId;
        public Boolean success;
        public String error;
        
        public ChatResponse() {
            this.success = true;
        }
    }
    
    /**
     * POST endpoint to send message to Agentforce agent
     */
    @HttpPost
    global static ChatResponse sendMessage() {
        ChatResponse response = new ChatResponse();
        
        try {
            // Parse request
            RestRequest req = RestContext.request;
            String requestBody = req.requestBody.toString();
            ChatRequest chatRequest = (ChatRequest) JSON.deserialize(requestBody, ChatRequest.class);
            
            // Validate request
            if (String.isBlank(chatRequest.agentName)) {
                throw new IllegalArgumentException('Agent name is required');
            }
            if (String.isBlank(chatRequest.message)) {
                throw new IllegalArgumentException('Message is required');
            }
            
            // Prepare Invocable Action request
            Invocable.Action action = Invocable.Action.createCustomAction('apex', 'AgentChat');
            action.setInvocationParameter('agentName', chatRequest.agentName);
            action.setInvocationParameter('userMessage', chatRequest.message);
            
            if (String.isNotBlank(chatRequest.sessionId)) {
                action.setInvocationParameter('sessionId', chatRequest.sessionId);
            }
            
            // Invoke the agent
            List<Invocable.Action.Result> results = action.invoke();
            
            if (results != null && !results.isEmpty()) {
                Invocable.Action.Result result = results[0];
                
                if (result.isSuccess()) {
                    // Extract response from result
                    Map<String, Object> outputValues = result.getOutputParameters();
                    
                    response.message = (String) outputValues.get('responseMessage');
                    response.sessionId = (String) outputValues.get('sessionId');
                    response.success = true;
                } else {
                    // Handle errors
                    List<Invocable.Action.Error> errors = result.getErrors();
                    String errorMessage = 'Unknown error occurred';
                    
                    if (errors != null && !errors.isEmpty()) {
                        errorMessage = errors[0].getMessage();
                    }
                    
                    response.success = false;
                    response.error = errorMessage;
                    response.message = 'I apologize, but I encountered an error processing your request.';
                }
            } else {
                response.success = false;
                response.error = 'No response from agent';
                response.message = 'I apologize, but I could not generate a response.';
            }
            
        } catch (Exception e) {
            response.success = false;
            response.error = e.getMessage();
            response.message = 'An error occurred: ' + e.getMessage();
            
            // Log error
            System.debug(LoggingLevel.ERROR, 'AgentforceChatAPI Error: ' + e.getMessage());
            System.debug(LoggingLevel.ERROR, 'Stack Trace: ' + e.getStackTraceString());
        }
        
        return response;
    }
    
    /**
     * GET endpoint to check API status
     */
    @HttpGet
    global static Map<String, Object> getStatus() {
        Map<String, Object> status = new Map<String, Object>();
        status.put('status', 'active');
        status.put('timestamp', DateTime.now().format());
        status.put('apiVersion', 'v1.0');
        return status;
    }
}
