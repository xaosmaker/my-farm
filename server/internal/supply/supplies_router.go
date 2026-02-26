package supply

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func protectedRoutes(q suppliesQueries) *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", httpx.Handler(q.createSupply))
	r.Patch("/{supplyId}", httpx.Handler(q.updateSupply))
	r.Delete("/{supplyId}", httpx.Handler(q.deleteSupply))
	return r
}

func SuppliesRouter(con *pgxpool.Pool) *chi.Mux {
	q := suppliesQueries{DB: *db.New(con)}
	r := chi.NewRouter()
	r.Get("/", httpx.Handler(q.getAllSupplies))
	r.Get("/{supplyId}", httpx.Handler(q.getSupplyDetails))
	r.Mount("/", protectedRoutes(q))

	return r
}
