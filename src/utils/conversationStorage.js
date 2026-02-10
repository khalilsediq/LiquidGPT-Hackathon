const CONVERSATIONS_KEY = 'chatgpt-clone-conversations';
const CURRENT_CONVERSATION_KEY = 'chatgpt-clone-current-conversation';

export const saveConversation = (conversationId, messages) => {
  try {
    const conversations = getAllConversations();
    const existingIndex = conversations.findIndex(conv => conv.id === conversationId);
    
    const conversationData = {
      id: conversationId,
      messages,
      title: generateTitle(messages),
      timestamp: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      conversations[existingIndex] = conversationData;
    } else {
      conversations.unshift(conversationData);
    }

    // Keep only last 50 conversations
    const limitedConversations = conversations.slice(0, 50);
    
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(limitedConversations));
    return conversationData;
  } catch (error) {
    console.warn('Failed to save conversation:', error);
    return null;
  }
};

export const getAllConversations = () => {
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load conversations:', error);
    return [];
  }
};

export const getConversation = (conversationId) => {
  try {
    const conversations = getAllConversations();
    return conversations.find(conv => conv.id === conversationId);
  } catch (error) {
    console.warn('Failed to get conversation:', error);
    return null;
  }
};

export const deleteConversation = (conversationId) => {
  try {
    const conversations = getAllConversations();
    const filteredConversations = conversations.filter(conv => conv.id !== conversationId);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(filteredConversations));
    
    // Clear current conversation if it was deleted
    const currentId = getCurrentConversationId();
    if (currentId === conversationId) {
      localStorage.removeItem(CURRENT_CONVERSATION_KEY);
    }
  } catch (error) {
    console.warn('Failed to delete conversation:', error);
  }
};

export const setCurrentConversationId = (conversationId) => {
  try {
    localStorage.setItem(CURRENT_CONVERSATION_KEY, conversationId);
  } catch (error) {
    console.warn('Failed to set current conversation:', error);
  }
};

export const getCurrentConversationId = () => {
  try {
    return localStorage.getItem(CURRENT_CONVERSATION_KEY);
  } catch (error) {
    console.warn('Failed to get current conversation:', error);
    return null;
  }
};

export const generateTitle = (messages) => {
  if (!messages || messages.length === 0) return 'New Chat';
  
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  if (!firstUserMessage) return 'New Chat';
  
  const content = firstUserMessage.content;
  const words = content.split(' ').slice(0, 6).join(' ');
  return words.length > 40 ? words.substring(0, 40) + '...' : words;
};

export const generateConversationId = () => {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
