package farm

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
	farm_handlers "github.com/xaosmaker/server/internal/farm/handlers"
)

func FarmRouter(con *pgxpool.Pool) *http.ServeMux {
	q := farm_handlers.FarmQeuries{
		DB: *db.New(con),
	}
	mux := http.NewServeMux()
	mux.HandleFunc("POST /farms", q.CreateFarm)
	return mux

}
