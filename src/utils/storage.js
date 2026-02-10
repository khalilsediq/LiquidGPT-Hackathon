const STORAGE_KEY = 'chatgpt-clone-conversations';

export const saveConversation = (conversation) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
  } catch (error) {
    console.warn('Failed to save conversation to localStorage:', error);
  }
};

export const loadConversation = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load conversation from localStorage:', error);
    return [];
  }
};

export const clearConversation = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear conversation from localStorage:', error);
  }
};
