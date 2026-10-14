CREATE TABLE usage_events (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL UNIQUE,
    api_key_hash CHAR(64) NOT NULL,
    prompt_hash CHAR(64) NOT NULL,
    cache_hit BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_usage_events_created_at
    ON usage_events(created_at DESC);

CREATE INDEX idx_usage_events_api_key_hash
    ON usage_events(api_key_hash);
