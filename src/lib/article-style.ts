/**
 * 記事本文の囲みボックス・要点ボックスのデザイン切り替え。
 *
 * - "plain": 囲みは普通の段落として表示、要点ボックスは出さない
 * - "a": 細い1pxの線で囲む枠。背景は白
 * - "b": 上下の罫線だけで区切る。雑誌のプルクォート風
 * - "c"（いまの設定・CEOが選んだ案）: 黒地に白文字。サムネイルの雰囲気
 *
 * 切り替えはビルド時の環境変数 NEXT_PUBLIC_ARTICLE_BOX_STYLE（a / b / c / plain）。
 * 未設定なら DEFAULT_ARTICLE_BOX_STYLE を使う。選ばれた案を本番に出すときは、
 * ここの既定値を変えるか、環境変数を付けてビルドする。
 * a / b / c のときは、お知らせ以外の記事で最初の段落が要点ボックスになる。
 */
export type ArticleBoxStyle = "plain" | "a" | "b" | "c";

export const DEFAULT_ARTICLE_BOX_STYLE: ArticleBoxStyle = "c";

function parseStyle(value: string | undefined): ArticleBoxStyle | null {
  const v = (value ?? "").trim().toLowerCase();
  return v === "plain" || v === "a" || v === "b" || v === "c" ? v : null;
}

export const ARTICLE_BOX_STYLE: ArticleBoxStyle =
  parseStyle(process.env.NEXT_PUBLIC_ARTICLE_BOX_STYLE) ?? DEFAULT_ARTICLE_BOX_STYLE;

/** 本文の div に付けるクラス。summary = 要点ボックスを出す記事かどうか */
export function articleBodyClassName(summary: boolean, style: ArticleBoxStyle = ARTICLE_BOX_STYLE): string {
  const classes = ["article-body", "font-sans", "leading-loose", `box-${style}`];
  if (style !== "plain" && summary) classes.push("has-summary");
  return classes.join(" ");
}
