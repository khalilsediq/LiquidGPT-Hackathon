import React, { useState } from "react";
import {
  getAllConversations,
  deleteConversation,
  generateConversationId,
} from "../utils/conversationStorage";
import logo from "../assets/logo.jfif";

const Sidebar = ({
  isOpen,
  onToggle,
  currentConversationId,
  onConversationSelect,
  onNewChat,
}) => {
  const [conversations, setConversations] = useState([]);
  const [isDeleting, setIsDeleting] = useState(null);

  React.useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  const loadConversations = () => {
    const convs = getAllConversations();
    setConversations(convs);
  };

  const handleDeleteConversation = async (e, conversationId) => {
    e.stopPropagation();
    setIsDeleting(conversationId);

    try {
      deleteConversation(conversationId);
      loadConversations();

      // If current conversation was deleted, start new chat
      if (currentConversationId === conversationId) {
        onNewChat();
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleNewChat = () => {
    onNewChat();
    onToggle(); // Close sidebar on mobile after creating new chat
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 bg-white dark:bg-[var(--bg-secondary)] border-r border-gray-200 dark:border-[var(--border-primary)]
        transition-all duration-300 ease-in-out flex flex-col
        lg:static lg:z-0
        ${isOpen ? "translate-x-0 lg:w-64 lg:translate-x-0" : "-translate-x-full lg:w-0 lg:translate-x-0 lg:overflow-hidden"}
        w-64
      `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-[var(--border-primary)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <img
                src={logo}
                alt="LiquidGPT Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                LiquidGPT
              </h2>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4">
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No conversations yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Start a new chat to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`
                    group relative p-3 rounded-lg cursor-pointer transition-colors
                    ${
                      currentConversationId === conversation.id
                        ? "bg-blue-50 dark:bg-[var(--bg-hover)] border border-blue-200 dark:border-[var(--border-primary)]"
                        : "hover:bg-gray-50 dark:hover:bg-[var(--bg-hover)] border border-transparent"
                    }
                  `}
                  onClick={() => onConversationSelect(conversation.id)}
                >
                  <div className="pr-8">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {conversation.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(conversation.timestamp)}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) =>
                      handleDeleteConversation(e, conversation.id)
                    }
                    disabled={isDeleting === conversation.id}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isDeleting === conversation.id ? (
                      <div className="w-4 h-4 border border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
