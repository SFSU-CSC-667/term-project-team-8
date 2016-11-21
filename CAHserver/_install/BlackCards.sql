DROP TABLE IF EXISTS "blackcards" CASCADE;
CREATE TABLE IF NOT EXISTS "blackcards"(
id SERIAL PRIMARY KEY,
game_id INTEGER REFERENCES "game"(game_id),
bcid INTEGER REFERENCES "blackDeck"(bcid),
player_id INTEGER REFERENCES "player"(player_id),
status SMALLINT NOT NULL,
CHECK (status >= 0 AND status <= 10)
);

