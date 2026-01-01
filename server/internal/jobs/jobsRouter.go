package jobs

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/jobs/handlers"
)

func jobProtectedRouter(q handlers.JobsQueries) *chi.Mux {

	r := chi.NewRouter()
	r.Post("/", q.CreateJob)
	return r

}

func JobsRouter(con *pgxpool.Pool) *chi.Mux {
	q := handlers.JobsQueries{
		DB: *db.New(con),
	}
	r := chi.NewRouter()

	r.Get("/{fieldId}", q.GetAllJobs)
	r.Get("/{fieldId}/{jobId}", q.GetJobDetails)
	r.Mount("/", jobProtectedRouter(q))

	return r
}
