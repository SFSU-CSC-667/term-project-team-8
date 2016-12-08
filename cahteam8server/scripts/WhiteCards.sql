DROP TABLE IF EXISTS "whitecards" CASCADE;
CREATE TABLE IF NOT EXISTS "whitecards"(
id SERIAL PRIMARY KEY,
game_id INTEGER REFERENCES "game"(game_id),
wcid INTEGER REFERENCES "whitedeck"(wcid),
player_id INTEGER REFERENCES "player"(player_id),
status SMALLINT NOT NULL,
CHECK (status >= 0 AND status <= 10)
);

