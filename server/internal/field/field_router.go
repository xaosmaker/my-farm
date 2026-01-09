package field

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
)

func fieldProtectedRouter(q fieldQueries) *chi.Mux {

	r := chi.NewRouter()
	r.Post("/", q.createField)
	r.Patch("/{id}", q.updateField)
	r.Delete("/{id}", q.deleteField)
	return r

}

func FieldRouter(con *pgxpool.Pool) *chi.Mux {
	q := fieldQueries{
		DB: *db.New(con),
	}
	r := chi.NewRouter()
	r.Get("/{id}", q.getFieldById)
	r.Get("/", q.getAllFields)

	r.Mount("/", fieldProtectedRouter(q))

	return r
}
