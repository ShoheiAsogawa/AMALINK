-- コラムのジャンル列。CMSカテゴリ（column）とは別。
-- すでに ensureReady で足されている場合は「duplicate column name: genre」になるので、そのときはこのファイルを飛ばす。
ALTER TABLE posts ADD COLUMN genre TEXT;
