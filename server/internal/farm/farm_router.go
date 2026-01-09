package farm

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
)

func farmsProtectedRouter(q farmQeuries) *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", q.createFarm)

	return r
}

func FarmRouter(con *pgxpool.Pool) *chi.Mux {
	q := farmQeuries{
		DB: *db.New(con),
	}
	r := chi.NewRouter()

	r.Get("/", q.getFarm)
	r.Mount("/", farmsProtectedRouter(q))
	return r

}
