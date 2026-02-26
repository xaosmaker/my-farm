package season

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func (q seasonsQueries) protectedSeasonRouter() *chi.Mux {
	r := chi.NewRouter()
	r.Post("/{fieldId}", httpx.Handler(q.createSeason))
	r.Delete("/{seasonId}", httpx.Handler(q.deleteSeason))
	r.Patch("/{seasonId}", httpx.Handler(q.updateSeason))

	return r

}

func SeasonsRouter(con *pgxpool.Pool) *chi.Mux {
	q := seasonsQueries{
		DB: *db.New(con),
	}
	r := chi.NewRouter()
	r.Get("/", httpx.Handler(q.getAllActiveSeasons))
	r.Get("/{fieldId}", httpx.Handler(q.getAllSeasons))
	r.Get("/{seasonId}/details", httpx.Handler(q.getSeasonDetails))
	r.Get("/statistics/{seasonId}", httpx.Handler(q.getSeasonStatictic))
	r.Mount("/", q.protectedSeasonRouter())

	return r

}
