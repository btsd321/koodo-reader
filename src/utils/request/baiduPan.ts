import { ConfigService } from "../../assets/lib/kookit-extra-browser.min";

export const getBaiduAppKey = (): string =>
  ConfigService.getItem("baiduPan_appKey") || "";
export const getBaiduSecretKey = (): string =>
  ConfigService.getItem("baiduPan_secretKey") || "";
export const getBaiduAppName = (): string =>
  ConfigService.getItem("baiduPan_appName") || "koodo-reader";
export const BAIDU_REDIRECT_URI = "koodo-reader://oauth/baidu";

export const getBaiduAuthUrl = (): string => {
  const appKey = getBaiduAppKey();
  return (
    `https://openapi.baidu.com/oauth/2.0/authorize` +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(appKey)}` +
    `&redirect_uri=${encodeURIComponent(BAIDU_REDIRECT_URI)}` +
    `&scope=basic%2Cnetdisk` +
    `&display=popup`
  );
};

export const baiduExchangeToken = async (
  code: string
): Promise<{ access_token: string; refresh_token: string; expires_in: number } | null> => {
  const url =
    `https://openapi.baidu.com/oauth/2.0/token` +
    `?grant_type=authorization_code` +
    `&code=${encodeURIComponent(code)}` +
    `&client_id=${encodeURIComponent(getBaiduAppKey())}` +
    `&client_secret=${encodeURIComponent(getBaiduSecretKey())}` +
    `&redirect_uri=${encodeURIComponent(BAIDU_REDIRECT_URI)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.access_token) return null;
  return data;
};

export const baiduRefreshToken = async (
  refreshToken: string
): Promise<{ access_token: string; refresh_token: string; expires_in: number } | null> => {
  const url =
    `https://openapi.baidu.com/oauth/2.0/token` +
    `?grant_type=refresh_token` +
    `&refresh_token=${encodeURIComponent(refreshToken)}` +
    `&client_id=${encodeURIComponent(getBaiduAppKey())}` +
    `&client_secret=${encodeURIComponent(getBaiduSecretKey())}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.access_token) return null;
  return data;
};

export const baiduListFiles = async (
  accessToken: string,
  dir: string
): Promise<any[]> => {
  const url =
    `https://pan.baidu.com/rest/2.0/xpan/file?method=list` +
    `&access_token=${encodeURIComponent(accessToken)}` +
    `&dir=${encodeURIComponent(dir)}` +
    `&order=name&start=0&limit=1000`;
  const res = await fetch(url);
  const data = await res.json();
  return data.list || [];
};

export const baiduGetDownloadLink = async (
  accessToken: string,
  fsid: number
): Promise<string | null> => {
  const url =
    `https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas` +
    `&access_token=${encodeURIComponent(accessToken)}` +
    `&fsids=${encodeURIComponent(JSON.stringify([fsid]))}` +
    `&dlink=1`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.list && data.list[0] && data.list[0].dlink) {
    return data.list[0].dlink;
  }
  return null;
};

const md5Blob = async (blob: Blob): Promise<string> => {
  const buffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("MD5", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const baiduUploadFile = async (
  accessToken: string,
  path: string,
  blob: Blob
): Promise<any> => {
  const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB
  const size = blob.size;
  const chunks: Blob[] = [];
  for (let i = 0; i < size; i += CHUNK_SIZE) {
    chunks.push(blob.slice(i, Math.min(i + CHUNK_SIZE, size)));
  }
  const blockList: string[] = await Promise.all(chunks.map(md5Blob));

  // Step 1: precreate
  const preForm = new URLSearchParams();
  preForm.append("path", path);
  preForm.append("size", String(size));
  preForm.append("isdir", "0");
  preForm.append("autoinit", "1");
  preForm.append("block_list", JSON.stringify(blockList));
  const preRes = await fetch(
    `https://pan.baidu.com/rest/2.0/xpan/file?method=precreate&access_token=${encodeURIComponent(accessToken)}`,
    { method: "POST", body: preForm }
  );
  const preData = await preRes.json();
  if (preData.errno !== 0 && preData.errno !== undefined) {
    throw new Error(`Precreate failed: errno=${preData.errno}`);
  }
  const uploadid = preData.uploadid;

  // Step 2: upload slices
  for (let i = 0; i < chunks.length; i++) {
    const formData = new FormData();
    formData.append("file", chunks[i], "blob");
    const uploadUrl =
      `https://d.pcs.baidu.com/rest/2.0/pcs/superfile2?method=upload` +
      `&access_token=${encodeURIComponent(accessToken)}` +
      `&type=tmpfile` +
      `&path=${encodeURIComponent(path)}` +
      `&uploadid=${encodeURIComponent(uploadid)}` +
      `&partseq=${i}`;
    const upRes = await fetch(uploadUrl, { method: "POST", body: formData });
    const upData = await upRes.json();
    if (upData.errno !== 0 && upData.errno !== undefined) {
      throw new Error(`Upload slice ${i} failed: errno=${upData.errno}`);
    }
  }

  // Step 3: create
  const createForm = new URLSearchParams();
  createForm.append("path", path);
  createForm.append("size", String(size));
  createForm.append("isdir", "0");
  createForm.append("uploadid", uploadid);
  createForm.append("block_list", JSON.stringify(blockList));
  createForm.append("rtype", "3");
  const createRes = await fetch(
    `https://pan.baidu.com/rest/2.0/xpan/file?method=create&access_token=${encodeURIComponent(accessToken)}`,
    { method: "POST", body: createForm }
  );
  const createData = await createRes.json();
  if (createData.errno !== 0 && createData.errno !== undefined) {
    throw new Error(`Create failed: errno=${createData.errno}`);
  }
  return createData;
};

export const baiduDeleteFile = async (
  accessToken: string,
  path: string
): Promise<void> => {
  const form = new URLSearchParams();
  form.append("filelist", JSON.stringify([path]));
  await fetch(
    `https://pan.baidu.com/rest/2.0/xpan/file?method=filemanager&opera=delete&access_token=${encodeURIComponent(accessToken)}`,
    { method: "POST", body: form }
  );
};

export const baiduCreateFolder = async (
  accessToken: string,
  path: string
): Promise<void> => {
  const form = new URLSearchParams();
  form.append("path", path);
  form.append("isdir", "1");
  form.append("size", "0");
  form.append("block_list", "[]");
  form.append("rtype", "0");
  await fetch(
    `https://pan.baidu.com/rest/2.0/xpan/file?method=create&access_token=${encodeURIComponent(accessToken)}`,
    { method: "POST", body: form }
  );
};
