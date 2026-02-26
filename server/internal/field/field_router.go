package field

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func fieldProtectedRouter(q fieldQueries) *chi.Mux {

	r := chi.NewRouter()
	r.Post("/", httpx.Handler(q.createField))
	r.Patch("/{id}", httpx.Handler(q.updateField))
	r.Delete("/{id}", httpx.Handler(q.deleteField))
	return r

}

func FieldRouter(con *pgxpool.Pool) *chi.Mux {
	q := fieldQueries{
		DB: *db.New(con),
	}
	r := chi.NewRouter()
	r.Get("/{id}", httpx.Handler(q.getFieldById))
	r.Get("/", httpx.Handler(q.getAllFields))

	r.Mount("/", fieldProtectedRouter(q))

	return r
}
