import {
  baiduListFiles,
  baiduGetDownloadLink,
  baiduUploadFile,
  baiduDeleteFile,
  baiduCreateFolder,
  getBaiduAppName,
} from "../request/baiduPan";

export class BaiduSyncUtil {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  private getFilePath(fileName: string, type: string): string {
    const appName = getBaiduAppName();
    return `/apps/${appName}/${type}/${fileName}`;
  }

  private getFolderPath(type: string): string {
    const appName = getBaiduAppName();
    return `/apps/${appName}/${type}`;
  }

  async uploadFile(fileName: string, type: string, blob: Blob): Promise<any> {
    const accessToken = this.config.access_token;
    const folderPath = this.getFolderPath(type);
    const filePath = this.getFilePath(fileName, type);
    // Ensure folder exists
    try {
      await baiduCreateFolder(accessToken, folderPath);
    } catch (_e) {
      // Folder may already exist, ignore
    }
    return await baiduUploadFile(accessToken, filePath, blob);
  }

  async downloadFile(fileName: string, type: string): Promise<Blob> {
    const accessToken = this.config.access_token;
    const filePath = this.getFilePath(fileName, type);
    // Find the file's fsid
    const folderPath = this.getFolderPath(type);
    const files = await baiduListFiles(accessToken, folderPath);
    const file = files.find((f: any) => f.path === filePath);
    if (!file) {
      throw new Error(`File not found: ${filePath}`);
    }
    const dlink = await baiduGetDownloadLink(accessToken, file.fs_id);
    if (!dlink) {
      throw new Error(`Failed to get download link for: ${filePath}`);
    }
    const res = await fetch(`${dlink}&access_token=${encodeURIComponent(accessToken)}`, {
      headers: { "User-Agent": "pan.baidu.com" },
    });
    if (!res.ok) {
      throw new Error(`Download failed: ${res.status}`);
    }
    return await res.blob();
  }

  async deleteFile(fileName: string, type: string): Promise<void> {
    const accessToken = this.config.access_token;
    const filePath = this.getFilePath(fileName, type);
    await baiduDeleteFile(accessToken, filePath);
  }

  async listFiles(type: string): Promise<any[]> {
    const accessToken = this.config.access_token;
    const folderPath = this.getFolderPath(type);
    try {
      const files = await baiduListFiles(accessToken, folderPath);
      return files.map((f: any) => ({
        name: f.server_filename,
        path: f.path,
        size: f.size,
        modified: f.server_mtime,
      }));
    } catch (_e) {
      return [];
    }
  }
}
