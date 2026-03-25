import {
  browserName,
  browserVersion,
  isElectron,
  osName,
  osVersion,
} from "react-device-detect";
import {
  ConfigService,
  KookitConfig,
  TokenService,
  UserRequest,
} from "../../assets/lib/kookit-extra-browser.min";
import packageJson from "../../../package.json";
import toast from "react-hot-toast";
import i18n from "../../i18n";
import { handleExitApp } from "./common";
import { getServerRegion } from "../common";
declare var window: any;
let userRequest: UserRequest | undefined;

const checkCloudUrlViaElectron = async (
  url: string
): Promise<string | null> => {
  try {
    const { ipcRenderer } = window.require("electron");
    const result = await ipcRenderer.invoke("check-cloud-url", { url });
    if (result.ok) return null;
    const reasonMap: Record<string, string> = {
      dns_failed: i18n.t(
        "DNS resolution failed, please check your network or DNS settings"
      ),
      connection_refused: i18n.t(
        "Connection refused, the server may be down or blocked by a firewall"
      ),
      connection_reset: i18n.t(
        "Connection was reset, possibly due to a firewall or proxy"
      ),
      timeout: i18n.t(
        "Connection timed out, please check your network connection"
      ),
      ssl_error: i18n.t(
        "SSL certificate error, please check your system time and certificates"
      ),
      invalid_url: i18n.t("Invalid server URL"),
    };
    const readable = reasonMap[result.reason] || result.reason;
    return `${readable} (${result.code || result.reason}: ${result.detail})`;
  } catch (e) {
    return null;
  }
};

export const loginRegister = async (_service: string, _code: string) => {
  // Official server call disabled
  return { code: 0, msg: "disabled" };
  /* original login logic removed */
};
export const getTempToken = async (): Promise<any> => {
  // Official server call disabled
  return { code: 0 };
};
export const fetchUserInfo = async (): Promise<any> => {
  // Official server call disabled
  return { code: 0 };
};
export const updateUserConfig = async (_config: any) => {
  // Official server call disabled
  return;
};
export const getUserRequest = async () => {
  if (userRequest) {
    return userRequest;
  }
  userRequest = new UserRequest(TokenService, ConfigService, getServerRegion());
  return userRequest;
};
export const resetUserRequest = () => {
  userRequest = undefined;
};
export const getOSName = () => {
  return isElectron ? osName : browserName;
};
export const detectBrowser = () => {
  var userAgent = navigator.userAgent;
  if (userAgent.indexOf("Edg") > -1) {
    return "Microsoft Edge";
  } else if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  } else if (userAgent.indexOf("Firefox") > -1) {
    return "Firefox";
  } else if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } else if (userAgent.indexOf("Opera") > -1) {
    return "Opera";
  } else if (
    userAgent.indexOf("Trident") > -1 ||
    userAgent.indexOf("MSIE") > -1
  ) {
    return "Internet Explorer";
  }

  return "Unknown";
};
export const getOsVersionNumber = (): string => {
  return isElectron ? osVersion : browserVersion;
};
