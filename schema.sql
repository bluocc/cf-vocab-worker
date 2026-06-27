-- 词库表
CREATE TABLE IF NOT EXISTS word_library (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL,
  reading TEXT,
  word_type TEXT NOT NULL,           -- 'vocab' 或 'kanji'
  level INTEGER NOT NULL,            -- 1-5 (N1-N5)
  is_added INTEGER DEFAULT 0,        -- 0=未添加 1=已添加
  UNIQUE(word, word_type)
);

CREATE INDEX IF NOT EXISTS idx_wl_type_level ON word_library(word_type, level);
CREATE INDEX IF NOT EXISTS idx_wl_is_added ON word_library(is_added);

-- 学习词汇表
CREATE TABLE IF NOT EXISTS learning_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL,
  reading TEXT,
  word_type INTEGER NOT NULL,        -- 1=手动输入 2=vocab 3=kanji
  level INTEGER,                     -- JLPT 1-5
  meaning_cn TEXT,
  word_type_detail TEXT,             -- 词性
  example_ja TEXT,
  example_cn TEXT,
  usage_note TEXT,
  speak_url TEXT,
  tspeak_url TEXT,
  minio_speak_url TEXT,
  minio_tspeak_url TEXT,
  dict_url TEXT,
  word_library_id INTEGER,
  is_learned INTEGER DEFAULT 0,      -- 0=未学习 1=已学习
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lw_is_learned ON learning_words(is_learned);
CREATE INDEX IF NOT EXISTS idx_lw_level ON learning_words(level);
CREATE INDEX IF NOT EXISTS idx_lw_library_id ON learning_words(word_library_id);
