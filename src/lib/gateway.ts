/** トップのミニゲームを一度見たあとの sessionStorage キー */
export const GATEWAY_SEEN_KEY = "amalink-gateway-seen";

/** React より前に走らせ、ハードリロード時の真っ白待ちを防ぐ */
export const GATEWAY_BOOT_SCRIPT = `
(function () {
  try {
    var path = location.pathname.replace(/\\/+$/, "") || "/";
    var isHome = path === "/";
    if (sessionStorage.getItem(${JSON.stringify(GATEWAY_SEEN_KEY)}) === "1") {
      document.documentElement.classList.add("amalink-gateway-seen");
    } else if (isHome) {
      document.documentElement.classList.add("amalink-gateway-pending");
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

export function markGatewayReady(): void {
  try {
    document.documentElement.classList.add("amalink-gateway-ready");
    document.documentElement.classList.remove("amalink-gateway-pending");
  } catch {
    /* ignore */
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
