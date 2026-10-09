#!/usr/bin/env node
/**
 * Wanda の Markdown 記事 → amalink-cms に入れる本文HTML
 *
 * 使い方:
 *   node scripts/md2cms.mjs 記事.md            # 本文HTMLを標準出力へ
 *   node scripts/md2cms.mjs 記事.md --json     # { frontmatter, html, warnings } を JSON で
 *
 * 決まりごと（/workspace/marketing/ARTICLE_FORMAT.md と同じ）:
 * - 先頭の --- で囲んだフロントマターは本文に入れない（--json の frontmatter に入る）
 * - 本文の先頭の H1（# 見出し）は取り除く。それ以外の H1 は H2 に下げる
 * - 生HTMLは使えない（文字としてエスケープされる）
 * - 画像の alt はそのまま残す（空なら警告）
 * - 囲みボックス: GitHub と同じ書き方。種類は POINT / WARNING / NOTE（大文字小文字どちらでも）
 *     > [!POINT]
 *     > 本文（複数行・太字・リスト・リンク可）
 *   → <div class="callout callout-point" role="note"><p class="callout-label">ポイント</p>…</div>
 *   （表示は案C：黒地に白文字。ラベルはサイト側で英字 KEY POINT / CAUTION / NOTE になる）
 *   記号の無い普通の > は、そのまま引用（<blockquote>）
 *   --callouts=plain を付けると、囲みを付けずに普通の段落として出す（予備）
 * - 外部リンクは新しいタブで開く（rel="noopener noreferrer"）
 * - 日本語のかぎかっこ・句読点のすぐ前後の **太字** も太字にする（markdown-it-cjk-friendly）
 *   変換後の本文に ** が残っていたら警告を出す
 */
import { readFileSync } from "node:fs";
import MarkdownIt from "markdown-it";
import cjkFriendly from "markdown-it-cjk-friendly";

export const CALLOUTS = {
  point: "ポイント",
  warning: "注意",
  note: "メモ",
};

/** 囲みの出し方: "box" = 囲みのHTMLを出す（既定） / "plain" = 普通の段落にする（予備） */
export const CALLOUT_MODE = "box";

const SITE_HOSTS = new Set(["amalink.co.jp", "www.amalink.co.jp"]);
const MARKER_RE = /^\s*\[!(point|warning|note)\][ \t]*(?:\r?\n|$)?/i;

export function parseFrontmatter(source) {
  const text = source.replace(/^\uFEFF/, "");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!match) return { frontmatter: {}, body: text };
  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      try {
        value = JSON.parse(value);
      } catch {
        value = value.slice(1, -1);
      }
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1).replace(/''/g, "'");
    }
    frontmatter[kv[1]] = value;
  }
  return { frontmatter, body: text.slice(match[0].length) };
}

function calloutPlugin(md, mode) {
  // inline の解析より前に、[!TYPE] で始まる引用を囲みボックスに変える
  md.core.ruler.before("inline", "amalink_callout", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i += 1) {
      const open = tokens[i];
      if (open.type !== "blockquote_open") continue;
      // 引用の最初の段落の中身を見る
      const pOpen = tokens[i + 1];
      const inline = tokens[i + 2];
      if (!pOpen || pOpen.type !== "paragraph_open" || !inline || inline.type !== "inline") continue;
      const match = inline.content.match(MARKER_RE);
      if (!match) continue;
      const kind = match[1].toLowerCase();
      inline.content = inline.content.slice(match[0].length).replace(/^\s+/, "");
      if (!inline.content) {
        // [!POINT] だけの行 → その段落は出さない
        tokens[i + 1].hidden = true;
        tokens[i + 3].hidden = true;
        inline.children = [];
      }
      open.meta = { ...(open.meta || {}), callout: kind };
      // 対応する blockquote_close を探して印を付ける
      let depth = 0;
      for (let j = i; j < tokens.length; j += 1) {
        if (tokens[j].type === "blockquote_open") depth += 1;
        if (tokens[j].type === "blockquote_close") {
          depth -= 1;
          if (depth === 0) {
            tokens[j].meta = { ...(tokens[j].meta || {}), callout: kind };
            break;
          }
        }
      }
    }
  });

  const defaultOpen = md.renderer.rules.blockquote_open || ((t, i, o, e, s) => s.renderToken(t, i, o));
  const defaultClose = md.renderer.rules.blockquote_close || ((t, i, o, e, s) => s.renderToken(t, i, o));
  md.renderer.rules.blockquote_open = (tokens, idx, options, env, self) => {
    const kind = tokens[idx].meta?.callout;
    if (!kind) return defaultOpen(tokens, idx, options, env, self);
    if (mode === "plain") return "";
    return `<div class="callout callout-${kind}" role="note"><p class="callout-label">${CALLOUTS[kind]}</p>\n`;
  };
  md.renderer.rules.blockquote_close = (tokens, idx, options, env, self) => {
    if (!tokens[idx].meta?.callout) return defaultClose(tokens, idx, options, env, self);
    if (mode === "plain") return "";
    return "</div>\n";
  };
}

function headingPlugin(md, warnings) {
  md.core.ruler.after("block", "amalink_headings", (state) => {
    const tokens = state.tokens;
    const first = tokens.findIndex((t) => !t.hidden);
    // 先頭の H1 を取り除く
    if (first >= 0 && tokens[first].type === "heading_open" && tokens[first].tag === "h1") {
      tokens.splice(first, 3);
    }
    // 残った H1 は H2 に下げる
    for (const token of tokens) {
      if ((token.type === "heading_open" || token.type === "heading_close") && token.tag === "h1") {
        token.tag = "h2";
        if (token.type === "heading_open") warnings.push("本文の途中の H1 を H2 に下げました");
      }
    }
  });
}

function linkAndImagePlugin(md, warnings) {
  const defaultLink = md.renderer.rules.link_open || ((t, i, o, e, s) => s.renderToken(t, i, o));
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet("href") || "";
    try {
      const url = new URL(href, "https://amalink.co.jp");
      if (/^https?:$/.test(url.protocol) && !SITE_HOSTS.has(url.hostname)) {
        tokens[idx].attrSet("target", "_blank");
        tokens[idx].attrSet("rel", "noopener noreferrer");
      }
    } catch {
      warnings.push(`リンク先が読めません: ${href}`);
    }
    return defaultLink(tokens, idx, options, env, self);
  };
  const defaultImage = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const alt = self.renderInlineAsText(token.children || [], options, env);
    if (!alt.trim()) warnings.push(`画像に alt がありません: ${token.attrGet("src")}`);
    return defaultImage(tokens, idx, options, env, self);
  };
}

export function convert(source, { calloutMode = CALLOUT_MODE } = {}) {
  const warnings = [];
  const notices = [];
  const { frontmatter, body } = parseFrontmatter(source);
  // html:false → 生HTMLは文字としてエスケープ。linkify:false → 素のURLは自動リンクにしない
  const md = new MarkdownIt({ html: false, linkify: false, typographer: false, breaks: false });
  // 「」**から のように、かぎかっこ・句読点のすぐ前後の ** も太字にする
  md.use(cjkFriendly);
  md.use((m) => calloutPlugin(m, calloutMode));
  md.use((m) => headingPlugin(m, warnings));
  md.use((m) => linkAndImagePlugin(m, warnings));
  if (/<[a-zA-Z/][^>]*>/.test(body)) warnings.push("生HTMLらしき書き方があります（文字として表示されます）");
  const html = md.render(body).trim();
  for (const line of html.split("\n")) {
    if (line.includes("**")) {
      const text = line.replace(/<[^>]+>/g, "");
      warnings.push(`太字にならなかった ** が残っています: ${text.slice(0, 60)}`);
    }
  }
  return { frontmatter, html, warnings, notices };
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const [file, ...flags] = process.argv.slice(2);
  if (!file) {
    console.error("使い方: node scripts/md2cms.mjs 記事.md [--json] [--callouts=box|plain]");
    process.exit(2);
  }
  const modeFlag = flags.find((f) => f.startsWith("--callouts="));
  const calloutMode = modeFlag ? modeFlag.split("=")[1] : CALLOUT_MODE;
  if (!["box", "plain"].includes(calloutMode)) {
    console.error(`--callouts は box か plain: ${calloutMode}`);
    process.exit(2);
  }
  const result = convert(readFileSync(file, "utf8"), { calloutMode });
  for (const notice of result.notices) console.error(`注意: ${notice}`);
  for (const warning of result.warnings) console.error(`警告: ${warning}`);
  if (flags.includes("--json")) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else process.stdout.write(`${result.html}\n`);
}
