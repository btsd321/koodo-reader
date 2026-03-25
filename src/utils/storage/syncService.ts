import {
  ConfigService,
  SyncUtil,
} from "../../assets/lib/kookit-extra-browser.min";
import { isTokenExpired } from "../common";
import { getCloudConfig } from "../file/common";
import { BaiduSyncUtil } from "./baiduSyncUtil";

class SyncService {
  private static syncUtilCache: { [key: string]: SyncUtil } = {};
  private static pickerUtilCache: { [key: string]: SyncUtil } = {};
  static async getSyncUtil() {
    let service = ConfigService.getItem("defaultSyncOption");
    if (!service) {
      return new SyncUtil("", {});
    }
    if (!this.syncUtilCache[service] || (await isTokenExpired(service))) {
      let config = await getCloudConfig(service);
      if (service === "dubox") {
        this.syncUtilCache[service] = new BaiduSyncUtil(config) as any;
      } else {
        this.syncUtilCache[service] = new SyncUtil(service, config);
      }
    }
    return this.syncUtilCache[service];
  }
  static removeSyncUtil(service) {
    delete this.syncUtilCache[service];
  }
  static async getPickerUtil(service: string) {
    if (!this.pickerUtilCache[service] || (await isTokenExpired(service))) {
      let config = await getCloudConfig(service);
      config.baseFolder = "";
      if (service === "dubox") {
        this.pickerUtilCache[service] = new BaiduSyncUtil(config) as any;
      } else {
        this.pickerUtilCache[service] = new SyncUtil(service, config);
      }
    }
    return this.pickerUtilCache[service];
  }
  static async removePickerUtil(service: string) {
    delete this.pickerUtilCache[service];
  }
}
export default SyncService;
