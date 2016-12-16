all:
	cat Player.sql Game.sql GamePlayer.sql WhiteDeck.sql BlackDeck.sql WhiteCards.sql BlackCards.sql > createTables.sql;

demo:
	cat Items.sql InsertItems.sql > demo.sql; psql -d "cah" -U "Admin" -f demo.sql;

setup:
	psql -f "createAdminAndDatabase.sql"
