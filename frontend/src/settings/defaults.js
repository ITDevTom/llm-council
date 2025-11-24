export const SETTINGS_STORAGE_KEY = 'llm-council-settings';

export const DEFAULT_SETTINGS = {
  councilModels: [
    'openai/gpt-5.1',
    'google/gemini-3-pro-preview',
    'anthropic/claude-sonnet-4.5',
    'x-ai/grok-4',
  ],
  chairmanModel: 'google/gemini-3-pro-preview',
};
