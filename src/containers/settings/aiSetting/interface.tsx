export interface AiSettingProps {
  t: (title: string) => string;
}
export interface AiSettingState {
  llmFormat: string;
  llmBaseUrl: string;
  llmApiKey: string;
  llmModel: string;
  ttsBaseUrl: string;
  ttsApiKey: string;
  ttsModel: string;
  ttsVoice: string;
  isTesting: boolean;
  testResult: string;
}
