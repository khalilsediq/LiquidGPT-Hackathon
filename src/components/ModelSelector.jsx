import React from 'react';
import { AVAILABLE_MODELS, DEFAULT_MODEL } from '../constants/models';

const ModelSelector = ({ selectedModel, onModelChange, disabled }) => {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="model-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Model:
      </label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={disabled}
        className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100"
      >
        {AVAILABLE_MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;
