import React, { useState, useRef, useEffect } from "react";

const ChatInput = ({ onSend, disabled, isLoading }) => {
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);

  const MAX_CHARS = 2000;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isLoading) {
      onSend(message.trim());
      setMessage("");
      setCharCount(0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    const newMessage = e.target.value;
    if (newMessage.length <= MAX_CHARS) {
      setMessage(newMessage);
      setCharCount(newMessage.length);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-[var(--border-primary)] bg-white dark:bg-[var(--bg-secondary)] p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Message LiquidGPT..."
            disabled={disabled || isLoading}
            className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-[var(--bg-tertiary)] border border-gray-300 dark:border-[var(--border-primary)] rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-[var(--text-primary)] placeholder-gray-500 dark:placeholder-[var(--text-tertiary)]"
            rows={1}
            style={{ minHeight: "52px", maxHeight: "200px" }}
          />

          <button
            type="submit"
            disabled={!message.trim() || disabled || isLoading}
            className="absolute right-2 bottom-2 p-2 bg-[var(--accent-primary)] text-white rounded-xl hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>
            {charCount}/{MAX_CHARS} characters
          </span>
          <span className="text-gray-400">
            Press Enter to send, Shift+Enter for new line
          </span>
        </div>

        {charCount >= MAX_CHARS * 0.9 && (
          <div className="text-xs text-orange-500 dark:text-orange-400 mt-1">
            Approaching character limit
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
