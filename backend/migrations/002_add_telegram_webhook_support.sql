ALTER TABLE bot_messages
  ADD COLUMN source VARCHAR(32) NOT NULL DEFAULT 'api',
  ADD COLUMN chat_id VARCHAR(64) NULL,
  ADD COLUMN telegram_message_id BIGINT NULL,
  ADD COLUMN telegram_update_id BIGINT NULL;

CREATE TABLE IF NOT EXISTS bot_authorized_chats (
  chat_id VARCHAR(64) PRIMARY KEY,
  authorized_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bot_messages_chat_id ON bot_messages (chat_id);
CREATE UNIQUE INDEX idx_bot_messages_telegram_update_id ON bot_messages (telegram_update_id);
