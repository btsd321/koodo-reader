import toast from "react-hot-toast";
import i18n from "../../i18n";
import {
  customTransStream,
  customDictStream,
  customAnswerStream,
  customTTSAudio,
  hasLLMConfig,
  hasTTSConfig,
} from "./customAI";
export const getTransStream = async (
  text: string,
  from: string,
  to: string,
  onMessage: (result) => void
) => {
  if (hasLLMConfig()) {
    return customTransStream(text, from, to, onMessage);
  }
  return { code: 0 };
};
export const getSummaryStream = async (
  _text: string,
  _to: string,
  _onMessage: (result) => void
) => {
  return { code: 0 };
};
export const getAnswerStream = async (
  text: string,
  question: string,
  history: any[],
  mode: string,
  onMessage: (result) => void
) => {
  if (hasLLMConfig()) {
    return customAnswerStream(text, question, history, mode, onMessage);
  }
  return { code: 0 };
};
export const getDictionaryStream = async (
  word: string,
  from: string,
  to: string,
  _isFullAnalysis: boolean,
  onMessage: (result) => void
) => {
  if (hasLLMConfig()) {
    return customDictStream(word, from, to, onMessage);
  }
  return { code: 0 };
};
export const getDictionary = async (_word: string, _from: string, _to: string) => {
  return { code: 0 };
};
export const getReaderRequest = async () => {
  return null as any;
};
export const resetReaderRequest = () => {};
export const getDictText = async (word: string, from: string, to: string) => {
  if (!hasLLMConfig()) {
    return "";
  }
  let dictText = "";
  let isFirst = true;
  await customDictStream(word, from, to, (result) => {
    if (result && result.text) {
      if (isFirst) {
        dictText = result.text;
        isFirst = false;
      } else {
        dictText += result.text;
      }
    }
  });
  if (dictText) {
    return (
      dictText +
      `<p class="dict-learn-more">${i18n.t("Generated with AI")}</p>`
    );
  }
  return "";
};
export const getOcrResult = async (_imageBase64: string, _lang: string) => {
  toast.error(i18n.t("Please configure custom AI in settings to use OCR"));
  return { code: 0 };
};
export const getTTSAudio = async (
  text: string,
  _language: string,
  voice: string,
  speed: number,
  _pitch: number,
  _isFirst: boolean
) => {
  if (!hasTTSConfig()) {
    toast.error(i18n.t("Please configure custom TTS in AI settings"));
    return null;
  }
  try {
    return await customTTSAudio(text, voice, speed);
  } catch (err) {
    toast.error(
      i18n.t("Fetch failed, error code") +
        ": " +
        (err instanceof Error ? err.message : String(err))
    );
    return null;
  }
};

