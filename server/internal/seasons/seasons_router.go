package seasons

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
)

func (q seasonsQueries) protectedSeasonRouter() *chi.Mux {
	r := chi.NewRouter()
	r.Post("/{fieldId}", q.createSeason)

	return r

}

func SeasonsRouter(con *pgxpool.Pool) *chi.Mux {
	q := seasonsQueries{
		DB: *db.New(con),
	}
	r := chi.NewRouter()
	r.Get("/{fieldId}", q.getAllSeasons)
	r.Get("/{fieldId}/{seasonId}", q.getSeasonDetails)
	r.Mount("/", q.protectedSeasonRouter())

	return r

}
