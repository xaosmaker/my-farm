package jobs

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
)

func jobProtectedRouter(q jobsQueries) *chi.Mux {

	r := chi.NewRouter()
	r.Post("/", q.createJob)
	return r

}

func JobsRouter(con *pgxpool.Pool) *chi.Mux {
	q := jobsQueries{
		DB: *db.New(con),
	}
	r := chi.NewRouter()

	r.Get("/{fieldId}", q.getAllJobs)
	r.Get("/{fieldId}/{jobId}", q.getJobDetails)
	r.Mount("/", jobProtectedRouter(q))

	return r
}
