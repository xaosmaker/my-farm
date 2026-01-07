package supplies

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/supplies/handlers"
)

func protectedRoutes(q handlers.SuppliesQueries) *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", q.CreateSupply)
	return r
}

func SuppliesRouter(con *pgxpool.Pool) *chi.Mux {
	q := handlers.SuppliesQueries{DB: *db.New(con)}
	r := chi.NewRouter()
	r.Get("/", q.GetAllSupplies)
	r.Get("/{supplyId}", q.GetSupplyDetails)
	r.Mount("/", protectedRoutes(q))

	return r
}
