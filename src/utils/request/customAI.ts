import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";

const getLLMConfig = () => ({
  format: ConfigService.getItem("customAI_llmFormat") || "openai",
  baseUrl:
    ConfigService.getItem("customAI_llmBaseUrl") ||
    "https://api.openai.com/v1",
  apiKey: ConfigService.getItem("customAI_llmApiKey") || "",
  model: ConfigService.getItem("customAI_llmModel") || "gpt-4o-mini",
});

const getTTSConfig = () => ({
  baseUrl:
    ConfigService.getItem("customAI_ttsBaseUrl") ||
    "https://api.openai.com/v1",
  apiKey: ConfigService.getItem("customAI_ttsApiKey") || "",
  model: ConfigService.getItem("customAI_ttsModel") || "tts-1",
  voice: ConfigService.getItem("customAI_ttsVoice") || "alloy",
});

export const hasLLMConfig = () => !!ConfigService.getItem("customAI_llmApiKey");
export const hasTTSConfig = () => !!ConfigService.getItem("customAI_ttsApiKey");

async function streamOpenAI(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: any[],
  onMessage: (result: any) => void
): Promise<any> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, stream: true }),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") {
        onMessage({ done: true });
        return { done: true, data: fullText };
      }
      try {
        const parsed = JSON.parse(data);
        const text = parsed.choices?.[0]?.delta?.content;
        if (text) {
          fullText += text;
          onMessage({ text });
        }
      } catch {}
    }
  }
  return { done: true, data: fullText };
}

async function streamAnthropic(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: any[],
  onMessage: (result: any) => void
): Promise<any> {
  const response = await fetch(`${baseUrl}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages,
      stream: true,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      try {
        const parsed = JSON.parse(data);
        if (parsed.type === "content_block_delta") {
          const text = parsed.delta?.text;
          if (text) {
            fullText += text;
            onMessage({ text });
          }
        } else if (parsed.type === "message_stop") {
          onMessage({ done: true });
          return { done: true, data: fullText };
        }
      } catch {}
    }
  }
  return { done: true, data: fullText };
}

async function streamLLM(
  messages: any[],
  onMessage: (result: any) => void
): Promise<any> {
  const { format, baseUrl, apiKey, model } = getLLMConfig();
  if (format === "anthropic") {
    return streamAnthropic(baseUrl, apiKey, model, messages, onMessage);
  }
  return streamOpenAI(baseUrl, apiKey, model, messages, onMessage);
}

export const customTransStream = async (
  text: string,
  from: string,
  to: string,
  onMessage: (result: any) => void
): Promise<any> => {
  const fromLabel = from && from !== "Automatic" ? ` from ${from}` : "";
  const messages = [
    {
      role: "user",
      content: `Translate the following text${fromLabel} to ${to}. Output only the translation, no explanations:\n\n${text}`,
    },
  ];
  return streamLLM(messages, onMessage);
};

export const customDictStream = async (
  word: string,
  _from: string,
  to: string,
  onMessage: (result: any) => void
): Promise<any> => {
  const messages = [
    {
      role: "user",
      content: `Provide a concise dictionary entry for the word "${word}" in ${to || "English"}. Include: pronunciation, part of speech, definition, and 1-2 example sentences. Format clearly.`,
    },
  ];
  return streamLLM(messages, onMessage);
};

export const customAnswerStream = async (
  text: string,
  question: string,
  history: any[],
  mode: string,
  onMessage: (result: any) => void
): Promise<any> => {
  const messages: any[] = [];
  if (mode === "ask" && text) {
    messages.push({
      role: "user",
      content: `You are a reading assistant. The following is the content of the current chapter:\n\n${text}\n\nPlease answer questions based on this content.`,
    });
    messages.push({ role: "assistant", content: "Understood." });
  }
  for (const h of history) {
    messages.push({ role: h.role, content: h.content });
  }
  messages.push({ role: "user", content: question });
  return streamLLM(messages, onMessage);
};

export const customTTSAudio = async (
  text: string,
  voice: string,
  speed: number
): Promise<any> => {
  const { baseUrl, apiKey, model, voice: defaultVoice } = getTTSConfig();
  const response = await fetch(`${baseUrl}/audio/speech`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: text,
      voice: voice || defaultVoice,
      speed: speed || 1.0,
    }),
  });
  if (!response.ok) {
    throw new Error(`TTS HTTP ${response.status}: ${await response.text()}`);
  }
  const buffer = await response.arrayBuffer();
  const base64 = btoa(
    String.fromCharCode(...new Uint8Array(buffer))
  );
  return { code: 200, data: { audio_base64: base64 } };
};
