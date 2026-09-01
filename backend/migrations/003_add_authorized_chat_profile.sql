ALTER TABLE bot_authorized_chats
  ADD COLUMN chat_type VARCHAR(50) NULL,
  ADD COLUMN username VARCHAR(255) NULL,
  ADD COLUMN first_name VARCHAR(255) NULL,
  ADD COLUMN last_name VARCHAR(255) NULL,
  ADD COLUMN last_seen_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX idx_bot_authorized_chats_authorized_at ON bot_authorized_chats (authorized_at);
