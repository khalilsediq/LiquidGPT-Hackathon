##chatGPT Clone, With the Name Of LiquidGPT.


LiquidGPT is a ChatGPT clone, for SMIT Hackathon built with React, Vite, and TailwindCSS v4. The application integrates with OpenRouter's API to provide multi-model AI chat capabilities with conversation management, dark mode, and a modern UI.

Tech Stack
Framework: React 19.2.0
Build Tool: Vite 7.3.1
Styling: TailwindCSS 4.1.18
Markdown Rendering: react-markdown with syntax highlighting
API: OpenRouter API (multiple free AI models)
🏗️ Architecture
Directory Structure
LiquidGPT/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   ├── logo.jfif        # Brand logo
│   │   └── react.svg
│   ├── components/
│   │   ├── ChatContainer.jsx
│   │   ├── ChatHeader.jsx
│   │   ├── ChatInput.jsx
│   │   ├── ChatMessage.jsx
│   │   ├── DarkModeToggle.jsx
│   │   ├── ModelSelector.jsx
│   │   └── Sidebar.jsx
│   ├── constants/
│   │   └── models.js
│   ├── hooks/
│   │   ├── useDarkMode.js
│   │   └── useOpenRouter.js
│   ├── utils/
│   │   ├── api.js
│   │   ├── conversationStorage.js
│   │   └── storage.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env                     # API key configuration
├── .env.example
├── index.html
├── package.json
└── vite.config.js