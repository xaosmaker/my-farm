package farm

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
	farm_handlers "github.com/xaosmaker/server/internal/farm/handlers"
)

func farmsProtectedRouter(q farm_handlers.FarmQeuries) *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", q.CreateFarm)

	return r
}

func FarmRouter(con *pgxpool.Pool) *chi.Mux {
	q := farm_handlers.FarmQeuries{
		DB: *db.New(con),
	}
	r := chi.NewRouter()

	r.Mount("/", farmsProtectedRouter(q))
	return r

}
