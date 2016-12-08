DROP TABLE IF EXISTS "game" CASCADE;
CREATE TABLE IF NOT EXISTS "game"(
game_id SERIAL PRIMARY KEY,
max_score SMALLINT NOT NULL,
wait_time INTEGER NOT NULL,
turn_end_time INTEGER NOT NULL,
dealer_id INTEGER  NOT NULL,
created_at TIMESTAMP DEFAULT now(),
modified_at TIMESTAMP DEFAULT now(),
CHECK (max_score >= 3 AND max_score <= 15)
);

