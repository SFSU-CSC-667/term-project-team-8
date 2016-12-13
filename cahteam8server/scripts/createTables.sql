DROP TABLE IF EXISTS "player" CASCADE;
CREATE TABLE IF NOT EXISTS "player"(
player_id SERIAL PRIMARY KEY,
username VARCHAR(30) NOT NULL UNIQUE,
password VARCHAR(30) NOT NULL,
email VARCHAR(60) NOT NULL UNIQUE,
score SMALLINT NOT NULL DEFAULT 0,
created_at TIMESTAMP DEFAULT now(),
modified_at TIMESTAMP DEFAULT now(),
CHECK (score >= 0)
);

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

DROP TABLE IF EXISTS "whitedeck" CASCADE;
CREATE TABLE IF NOT EXISTS "whitedeck"(
wcid SERIAL PRIMARY KEY,
wcvalue VARCHAR(150) NOT NULL
);

DROP TABLE IF EXISTS "blackdeck" CASCADE;
CREATE TABLE IF NOT EXISTS "blackdeck"(
bcid SERIAL PRIMARY KEY,
bcvalue VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS "whitecards" CASCADE;
CREATE TABLE IF NOT EXISTS "whitecards"(
id SERIAL PRIMARY KEY,
game_id INTEGER REFERENCES "game"(game_id),
wcid INTEGER REFERENCES "whitedeck"(wcid),
player_id INTEGER REFERENCES "player"(player_id),
status SMALLINT NOT NULL,
CHECK (status >= 0 AND status <= 10)
);

DROP TABLE IF EXISTS "blackcards" CASCADE;
CREATE TABLE IF NOT EXISTS "blackcards"(
id SERIAL PRIMARY KEY,
game_id INTEGER REFERENCES "game"(game_id),
bcid INTEGER REFERENCES "blackdeck"(bcid),
player_id INTEGER REFERENCES "player"(player_id),
status SMALLINT NOT NULL,
CHECK (status >= 0 AND status <= 10)
);

