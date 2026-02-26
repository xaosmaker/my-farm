package job

import (
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
)

func jobProtectedRouter(q jobsQueries) *chi.Mux {

	r := chi.NewRouter()
	r.Post("/", httpx.Handler(q.createJob))
	r.Delete("/{jobId}", httpx.Handler(q.deleteJob))
	return r

}

func JobsRouter(con *pgxpool.Pool) *chi.Mux {
	q := jobsQueries{
		DB: *db.New(con),
	}
	r := chi.NewRouter()

	r.Get("/{seasonId}", httpx.Handler(q.getAllJobs))
	// r.Get("/{fieldId}/{jobId}", q.getJobDetails)
	r.Mount("/", jobProtectedRouter(q))

	return r
}
