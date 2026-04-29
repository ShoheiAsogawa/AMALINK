const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** ハテナブロックから出す動物（17種）。ファイルは `/public/hatena-animals/01.png` … `17.png`。 */
export const HATENA_ANIMAL_SRC = Array.from(
  { length: 17 },
  (_, i) => `${base}/hatena-animals/${String(i + 1).padStart(2, "0")}.png`
);

/** crypto で均等な整数乱数（差し替え・並べ替えなしの単発抽選向け） */
export function randomAnimalIndex(length: number): number {
  if (length <= 1) return 0;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % length;
}
