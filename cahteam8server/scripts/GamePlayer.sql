DROP TABLE IF EXISTS "gameplayer" CASCADE;
CREATE TABLE IF NOT EXISTS "gameplayer"(
player_id INTEGER REFERENCES "player"(player_id) NOT NULL,
game_id INTEGER REFERENCES "game"(game_id) NOT NULL,
player_number SMALLINT NOT NULL,
score SMALLINT NOT NULL DEFAULT 0,
status INTEGER  NOT NULL DEFAULT 0,
CHECK (player_number >= 1 AND player_number <= 4),
CHECK (status >= 0 AND status <= 10)
);

