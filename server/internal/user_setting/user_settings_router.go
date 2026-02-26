package usersetting

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func UserSettingsRouter(pool *pgxpool.Pool) *chi.Mux {
	q := userSettingsQueries{
		DB: *db.New(pool),
	}
	r := chi.NewRouter()
	r.Get("/", httpx.Handler(q.getSettings))
	r.Post("/", httpx.Handler(q.updateSettings))

	return r
}
