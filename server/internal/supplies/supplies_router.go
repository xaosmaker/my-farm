package supplies

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
)

func protectedRoutes(q suppliesQueries) *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", q.createSupply)
	r.Delete("/{supplyId}", q.deleteSupply)
	return r
}

func SuppliesRouter(con *pgxpool.Pool) *chi.Mux {
	q := suppliesQueries{DB: *db.New(con)}
	r := chi.NewRouter()
	r.Get("/", q.getAllSupplies)
	r.Get("/{supplyId}", q.getSupplyDetails)
	r.Mount("/", protectedRoutes(q))

	return r
}
