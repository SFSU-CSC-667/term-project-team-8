CREATE TABLE IF NOT EXISTS items(
id SERIAL PRIMARY KEY,
text VARCHAR(40),
complete boolean default(false)
);

INSERT INTO items (text, complete)
VALUES
  ('bread',true),
  ('cheese',false),
  ('butter',true)
;
