import React from "react";
import { AiSettingProps, AiSettingState } from "./interface";
import { Trans } from "react-i18next";
import toast from "react-hot-toast";
import { ConfigService } from "../../../assets/lib/kookit-extra-browser.min";

const TTS_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];

class AiSetting extends React.Component<AiSettingProps, AiSettingState> {
  constructor(props: AiSettingProps) {
    super(props);
    this.state = {
      llmFormat: ConfigService.getItem("customAI_llmFormat") || "openai",
      llmBaseUrl:
        ConfigService.getItem("customAI_llmBaseUrl") ||
        "https://api.openai.com/v1",
      llmApiKey: ConfigService.getItem("customAI_llmApiKey") || "",
      llmModel: ConfigService.getItem("customAI_llmModel") || "gpt-4o-mini",
      ttsBaseUrl:
        ConfigService.getItem("customAI_ttsBaseUrl") ||
        "https://api.openai.com/v1",
      ttsApiKey: ConfigService.getItem("customAI_ttsApiKey") || "",
      ttsModel: ConfigService.getItem("customAI_ttsModel") || "tts-1",
      ttsVoice: ConfigService.getItem("customAI_ttsVoice") || "alloy",
      isTesting: false,
      testResult: "",
    };
  }

  handleSaveLLM = () => {
    ConfigService.setItem("customAI_llmFormat", this.state.llmFormat);
    ConfigService.setItem("customAI_llmBaseUrl", this.state.llmBaseUrl);
    ConfigService.setItem("customAI_llmApiKey", this.state.llmApiKey);
    ConfigService.setItem("customAI_llmModel", this.state.llmModel);
    toast.success(this.props.t("Setup successful"));
  };

  handleSaveTTS = () => {
    ConfigService.setItem("customAI_ttsBaseUrl", this.state.ttsBaseUrl);
    ConfigService.setItem("customAI_ttsApiKey", this.state.ttsApiKey);
    ConfigService.setItem("customAI_ttsModel", this.state.ttsModel);
    ConfigService.setItem("customAI_ttsVoice", this.state.ttsVoice);
    toast.success(this.props.t("Setup successful"));
  };

  handleTestLLM = async () => {
    if (!this.state.llmApiKey) {
      toast.error(this.props.t("Please fill in the API Key"));
      return;
    }
    this.setState({ isTesting: true, testResult: "" });
    try {
      const url =
        this.state.llmFormat === "anthropic"
          ? `${this.state.llmBaseUrl}/messages`
          : `${this.state.llmBaseUrl}/chat/completions`;
      const headers: any = { "Content-Type": "application/json" };
      let body: any;
      if (this.state.llmFormat === "anthropic") {
        headers["x-api-key"] = this.state.llmApiKey;
        headers["anthropic-version"] = "2023-06-01";
        body = {
          model: this.state.llmModel,
          max_tokens: 10,
          messages: [{ role: "user", content: "Hi" }],
        };
      } else {
        headers["Authorization"] = `Bearer ${this.state.llmApiKey}`;
        body = {
          model: this.state.llmModel,
          max_tokens: 10,
          messages: [{ role: "user", content: "Hi" }],
        };
      }
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (res.ok) {
        this.setState({ testResult: "✓ Connection successful" });
      } else {
        const text = await res.text();
        this.setState({ testResult: `✗ Error ${res.status}: ${text}` });
      }
    } catch (err) {
      this.setState({
        testResult: `✗ ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      this.setState({ isTesting: false });
    }
  };

  render() {
    return (
      <div>
        <div className="setting-dialog-new-title" style={{ marginTop: "10px" }}>
          <Trans>LLM Configuration</Trans>
          <span style={{ opacity: 0.5, fontSize: "12px" }}>
            <Trans>Translation / Dictionary / AI Assistant</Trans>
          </span>
        </div>

        <div className="setting-dialog-new-title">
          <Trans>API Format</Trans>
          <select
            className="lang-setting-dropdown"
            value={this.state.llmFormat}
            onChange={(e) => this.setState({ llmFormat: e.target.value })}
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
          </select>
        </div>

        <div className="setting-dialog-new-title">
          <Trans>Base URL</Trans>
          <input
            className="lang-setting-dropdown"
            type="text"
            value={this.state.llmBaseUrl}
            onChange={(e) => this.setState({ llmBaseUrl: e.target.value })}
            placeholder="https://api.openai.com/v1"
          />
        </div>

        <div className="setting-dialog-new-title">
          <Trans>API Key</Trans>
          <input
            className="lang-setting-dropdown"
            type="password"
            value={this.state.llmApiKey}
            onChange={(e) => this.setState({ llmApiKey: e.target.value })}
            placeholder="sk-..."
          />
        </div>

        <div className="setting-dialog-new-title">
          <Trans>Model Name</Trans>
          <input
            className="lang-setting-dropdown"
            type="text"
            value={this.state.llmModel}
            onChange={(e) => this.setState({ llmModel: e.target.value })}
            placeholder="gpt-4o-mini"
          />
        </div>

        <div className="setting-dialog-new-title">
          <span />
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span
              className="change-location-button"
              onClick={this.handleSaveLLM}
            >
              <Trans>Save</Trans>
            </span>
            <span
              className="change-location-button"
              onClick={this.handleTestLLM}
            >
              {this.state.isTesting ? (
                <Trans>Testing...</Trans>
              ) : (
                <Trans>Test Connection</Trans>
              )}
            </span>
            {this.state.testResult && (
              <span style={{ fontSize: "12px" }}>{this.state.testResult}</span>
            )}
          </div>
        </div>

        <div className="setting-dialog-new-title" style={{ marginTop: "20px" }}>
          <Trans>TTS Configuration</Trans>
          <span style={{ opacity: 0.5, fontSize: "12px" }}>
            <Trans>Text to Speech</Trans>
          </span>
        </div>

        <div className="setting-dialog-new-title">
          <Trans>Base URL</Trans>
          <input
            className="lang-setting-dropdown"
            type="text"
            value={this.state.ttsBaseUrl}
            onChange={(e) => this.setState({ ttsBaseUrl: e.target.value })}
            placeholder="https://api.openai.com/v1"
          />
        </div>

        <div className="setting-dialog-new-title">
          <Trans>API Key</Trans>
          <input
            className="lang-setting-dropdown"
            type="password"
            value={this.state.ttsApiKey}
            onChange={(e) => this.setState({ ttsApiKey: e.target.value })}
            placeholder="sk-..."
          />
        </div>

        <div className="setting-dialog-new-title">
          <Trans>Model Name</Trans>
          <input
            className="lang-setting-dropdown"
            type="text"
            value={this.state.ttsModel}
            onChange={(e) => this.setState({ ttsModel: e.target.value })}
            placeholder="tts-1"
          />
        </div>

        <div className="setting-dialog-new-title">
          <Trans>Default Voice</Trans>
          <select
            className="lang-setting-dropdown"
            value={this.state.ttsVoice}
            onChange={(e) => this.setState({ ttsVoice: e.target.value })}
          >
            {TTS_VOICES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="setting-dialog-new-title">
          <span />
          <span className="change-location-button" onClick={this.handleSaveTTS}>
            <Trans>Save</Trans>
          </span>
        </div>
      </div>
    );
  }
}

export default AiSetting;
