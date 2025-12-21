package field

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/field/handlers"
)

func fieldProtectedRouter(q handlers.FieldQueries) *chi.Mux {

	r := chi.NewRouter()
	r.Post("/", q.CreateField)
	r.Patch("/{id}", q.UpdateField)
	return r

}

func FieldRouter(con *pgxpool.Pool) *chi.Mux {
	q := handlers.FieldQueries{
		DB: *db.New(con),
	}
	r := chi.NewRouter()

	r.Mount("/", fieldProtectedRouter(q))

	return r
}
