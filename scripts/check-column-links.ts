/**
 * くろうさ：コラムの題名とURLを返答の末尾に付ける処理の確認（AIは呼ばない）。
 * 実行: npx esbuild scripts/check-column-links.ts --bundle --platform=node --tsconfig=tsconfig.json --outfile=/tmp/check-column-links.cjs && node /tmp/check-column-links.cjs [公開コラムJSON]
 * 公開コラムJSON（CMSの /api/public/columns を保存したもの）を渡すと、COLUMN_ARTICLES の題名・slug が公開中の記事と一致するかも確かめる。
 */
import { readFileSync } from "node:fs";
import {
  COLUMN_ARTICLES,
  appendColumnLinks,
  columnArticleUrl,
  matchColumnArticles,
} from "../src/lib/chatbot-knowledge";

let failed = 0;
function check(name: string, ok: boolean, detail = "") {
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` ${detail}` : ""}`);
}

const json = process.argv[2];
if (json) {
  const pub = (JSON.parse(readFileSync(json, "utf8")) as { contents: { slug: string; title: string }[] }).contents;
  const bySlug = new Map(pub.map((c) => [c.slug, c.title]));
  const bad = COLUMN_ARTICLES.filter((a) => bySlug.get(a.slug) !== a.title);
  check(`COLUMN_ARTICLES ${COLUMN_ARTICLES.length}本の題名・slugが公開中の${pub.length}本と一致`, bad.length === 0 && COLUMN_ARTICLES.length === pub.length, bad.map((a) => a.slug).join(","));
}

const cases: [string, string][] = [
  ["Claude Codeで手順書をスキルにするには？", "claude-code-skills-tejunsho"],
  ["AIがメールの中の指示にだまされることはある？", "prompt-injection-towa"],
  ["AIに毎週の仕事を任せるにはどうすればいい？", "ai-teiki-shigoto-routine"],
  ["シャドーAIって何？", "shadow-ai-taisaku"],
  ["AI導入の効果の測り方を教えて", "ai-donyu-kouka-hakarikata"],
  ["アカウントをつなぐときは、何を決めればいい？", "ai-agent-account-kengen"],
  ["ハルシネーションって何？", "hallucination-towa"],
];
for (const [q, slug] of cases) {
  const hits = matchColumnArticles(q);
  const expected = COLUMN_ARTICLES.find((a) => a.slug === slug)!;
  const out = appendColumnLinks("説明の本文だよ。", hits);
  check(`当たり: ${q}`, hits.length === 1 && hits[0].slug === slug && out.includes(expected.title) && out.includes(columnArticleUrl(expected)), hits.map((h) => h.slug).join(","));
}

// コラム以外の普通の質問には記事を付けない
for (const q of ["AMALINKってどんな会社ですか？", "ホームページ制作の料金はどのくらいですか？", "奄美大島のおすすめの観光地は？", "こんにちは"]) {
  const hits = matchColumnArticles(q);
  check(`付けない: ${q}`, hits.length === 0 && appendColumnLinks("本文", hits) === "本文", hits.map((h) => h.slug).join(","));
}
// 広いキーだけでも、「コラム」と聞かれたら記事を案内する
check("広いキー＋コラム: ホームページ制作のコラムはある？", matchColumnArticles("ホームページ制作のコラムはある？").length > 0);

// AIが断ったときは断りを消して案内に置き換える
const refused = appendColumnLinks("ごめんね、技術的な話は答えられないんだ。", matchColumnArticles("Claude Codeで手順書をスキルにするには？"));
check("断りの置き換え", !refused.includes("答えられない") && refused.includes("claude-code-skills-tejunsho"));
// すでに題名が本文にあるときは、URLだけ足す
const a = COLUMN_ARTICLES.find((x) => x.slug === "shadow-ai-taisaku")!;
const dup = appendColumnLinks(`コラムに「${a.title}」という記事があるよ。`, [a]);
check("題名の重複なし", dup.split(a.title).length === 2 && dup.includes(columnArticleUrl(a)));

process.exit(failed ? 1 : 0);
