package usersettings

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
)

func UserSettingsRouter(pool *pgxpool.Pool) *chi.Mux {
	q := userSettingsQueries{
		DB: *db.New(pool),
	}
	r := chi.NewRouter()
	r.Get("/", q.getSettings)
	r.Post("/", q.updateSettings)

	return r
}
