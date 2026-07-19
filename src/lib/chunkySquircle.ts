/** Node / ブラウザ間の浮動小数点差で hydration mismatch しないよう桁を固定 */
function coord(n: number): string {
  return n.toFixed(4);
}

/** chunky-3d-buttons と同じ squircle 輪郭（script.js の S と同等） */
export function squirclePath(w: number, h: number, r: number, x: number, y: number): string {
  let p = "";
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 31; i++) {
      const q = ((j + i / 30) * Math.PI) / 2;
      const c = Math.cos(q);
      const s = Math.sin(q);
      const px = x + (c > 0 ? w - r : r) + Math.sign(c) * Math.pow(Math.abs(c), 0.6) * r;
      const py = y + (s > 0 ? h - r : r) + Math.sign(s) * Math.pow(Math.abs(s), 0.6) * r;
      p += `${j || i ? "L" : "M"}${coord(px)} ${coord(py)}`;
    }
  }
  return `${p}Z`;
}

export function colorMix(hex: string, pct: number, key: "white" | "black"): string {
  return `color-mix(in srgb, #${hex} ${pct}%, ${key})`;
}
