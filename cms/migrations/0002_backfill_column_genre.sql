-- 既存コラムへジャンルを入れる。サイト側は未設定でもタイトルから判定するので、
-- この UPDATE は管理画面で最初からジャンルが見えるようにするためのもの。
UPDATE posts SET genre = 'ai-search-seo' WHERE kind = 'column' AND slug IN (
  'google-core-update-november-2026',
  'ai-kensaku-shindan-towa',
  'chatgpt-business-hub-towa',
  'geo-towa',
  'llms-txt-towa',
  'ai-content-seo',
  'ai-crawler-robots-txt',
  'chiiki-seo-keyword',
  'google-business-profile',
  'ai-kensaku-kozoka-data',
  'ai-kensaku-jisha-kakunin',
  'geo-taisaku-erabikata',
  'kanko-ai-kensaku',
  'google-ai-kensaku-koushiki-site'
);
UPDATE posts SET genre = 'ai-usage' WHERE kind = 'column' AND slug IN (
  'kanko-seisei-ai',
  'prompt-kakikata',
  'ai-agent-gyomu-katsuyo',
  'seisei-ai-shanai-rule',
  'ai-katsuyo-hajimekata',
  'seisei-ai-donyu-shien'
);
UPDATE posts SET genre = 'ai-basics' WHERE kind = 'column' AND slug IN (
  'ai-jigyosha-guideline',
  'ai-gazo-chosakuken',
  'multimodal-ai-towa',
  'local-llm-towa',
  'hallucination-towa',
  'seisei-ai-towa'
);
UPDATE posts SET genre = 'ai-chatbot' WHERE kind = 'column' AND slug IN (
  'rag-towa',
  'chatbot-faq-tsukaiwake',
  'line-ai-chat',
  'ai-avatar-sekkyaku',
  'ai-chatbot-donyu'
);
UPDATE posts SET genre = 'security' WHERE kind = 'column' AND slug IN (
  'fake-police-app-sms',
  'black-friday-fake-shop',
  'outlook-vulnerability-november-2026',
  'ai-bunsho-miwakekata',
  'ai-sagi-taisaku',
  'deepfake-miwakekata',
  'gengo-zeijakusei-2026-10',
  'php-zeijakusei'
);
UPDATE posts SET genre = 'web-production' WHERE kind = 'column' AND slug IN (
  'ai-gazo-hyoji',
  'ai-honyaku-tagengo',
  'homepage-jisaku-irai',
  'homepage-seisaku-hiyou',
  'amami-homepage-seisaku'
);
