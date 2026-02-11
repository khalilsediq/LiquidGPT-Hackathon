import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Sidebar from './Sidebar';
import DarkModeToggle from './DarkModeToggle';
import { useOpenRouter } from '../hooks/useOpenRouter';
import { useDarkMode } from '../hooks/useDarkMode';
import { 
  saveConversation, 
  getConversation, 
  getAllConversations, 
  setCurrentConversationId, 
  getCurrentConversationId, 
  generateConversationId 
} from '../utils/conversationStorage';
import { DEFAULT_MODEL } from '../constants/models';

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [currentConversationId, setCurrentConversationIdState] = useState(null);
  // Default to open on desktop (lg breakpoint is 1024px), closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const { send, isLoading, error, clearError } = useOpenRouter();
  const { isDark, toggleDarkMode } = useDarkMode();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Try to load current conversation
    const savedConversationId = getCurrentConversationId();
    if (savedConversationId) {
      const conversation = getConversation(savedConversationId);
      if (conversation && conversation.messages) {
        setMessages(conversation.messages);
        setCurrentConversationIdState(savedConversationId);
      } else {
        // Fallback to old storage format
        const savedMessages = localStorage.getItem('chatgpt-clone-conversations');
        if (savedMessages) {
          try {
            const parsed = JSON.parse(savedMessages);
            if (Array.isArray(parsed)) {
              setMessages(parsed);
              // Migrate to new format
              const newId = generateConversationId();
              saveConversation(newId, parsed);
              setCurrentConversationIdState(newId);
              setCurrentConversationId(newId);
            }
          } catch (error) {
            console.warn('Failed to migrate old conversation format:', error);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 && currentConversationId) {
      saveConversation(currentConversationId, messages);
    }
  }, [messages, currentConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (userMessage) => {
    // Create new conversation if needed
    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = generateConversationId();
      setCurrentConversationIdState(conversationId);
      setCurrentConversationId(conversationId);
    }

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    clearError();

    try {
      const conversationHistory = [
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      const aiResponse = await send(conversationHistory, selectedModel);

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Error: ${err.message}`,
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setCurrentConversationIdState(null);
    localStorage.removeItem('chatgpt-clone-current-conversation');
    clearError();
  };

  const handleNewChat = () => {
    setMessages([]);
    const newId = generateConversationId();
    setCurrentConversationIdState(newId);
    setCurrentConversationId(newId);
    clearError();
  };

  const handleConversationSelect = (conversationId) => {
    const conversation = getConversation(conversationId);
    if (conversation) {
      setMessages(conversation.messages || []);
      setCurrentConversationIdState(conversationId);
      setCurrentConversationId(conversationId);
      clearError();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleModelChange = (newModel) => {
    setSelectedModel(newModel);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        currentConversationId={currentConversationId}
        onConversationSelect={handleConversationSelect}
        onNewChat={handleNewChat}
      />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          onClearChat={handleClearChat}
          onNewChat={handleNewChat}
          onToggleSidebar={toggleSidebar}
          disabled={isLoading}
        >
          <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
        </ChatHeader>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to LiquidGPT
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Start a conversation by typing a message below.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Developed by <span className="font-semibold text-blue-600 dark:text-blue-400">QuettaCoders</span>
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isUser={message.role === 'user'}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-3xl mr-12">
                    <div className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
