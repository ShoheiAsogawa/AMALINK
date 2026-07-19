/** トップのミニゲームを一度見たあとの sessionStorage キー */
export const GATEWAY_SEEN_KEY = "amalink-gateway-seen";

/**
 * React より前に実行。2回目以降は seen を付けて本編を即表示する。
 * ※ pending で画面全体を隠さない（固まったように見えるのを防ぐ）
 */
export const GATEWAY_BOOT_SCRIPT = `
(function () {
  try {
    if (sessionStorage.getItem(${JSON.stringify(GATEWAY_SEEN_KEY)}) === "1") {
      document.documentElement.classList.add("amalink-gateway-seen");
    }
  } catch (e) {
    document.documentElement.classList.add("amalink-gateway-seen");
  }
})();
`.trim();

export function readGatewaySeen(): boolean {
  try {
    return sessionStorage.getItem(GATEWAY_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeGatewaySeen(): void {
  try {
    sessionStorage.setItem(GATEWAY_SEEN_KEY, "1");
  } catch {
    /* private browsing 等 */
  }
}

export function markGatewaySeenClass(): void {
  try {
    document.documentElement.classList.add("amalink-gateway-seen");
    document.documentElement.classList.remove("amalink-gateway-pending");
    document.documentElement.classList.remove("amalink-gateway-ready");
  } catch {
    /* ignore */
  }
}
