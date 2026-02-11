import React, { useState } from 'react';
import ModelSelector from './ModelSelector';

const ChatHeader = ({ selectedModel, onModelChange, onClearChat, onNewChat, onToggleSidebar, disabled, children }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleClearChat = () => {
    setShowConfirmDialog(true);
  };

  const confirmClearChat = () => {
    onClearChat();
    setShowConfirmDialog(false);
  };

  const cancelClearChat = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Sidebar toggle button (visible on all screens) */}
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 hidden sm:block">
              LiquidGPT
            </h1>
            
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={onModelChange}
              disabled={disabled}
            />
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* New Chat button */}
            <button
              onClick={onNewChat}
              disabled={disabled}
              className="hidden sm:flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
             
            {/* Mobile New Chat Icon */}
             <button
              onClick={onNewChat}
              disabled={disabled}
              className="sm:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Dark mode toggle */}
            <div className="flex items-center">
                {children}
            </div>
            
            {/* Clear Chat button */}
            <button
              onClick={handleClearChat}
              disabled={disabled}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Clear Chat History?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This action cannot be undone. All messages will be permanently deleted.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelClearChat}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearChat}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
