package app

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/auth"
	"github.com/xaosmaker/server/internal/config"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/farm"
	"github.com/xaosmaker/server/internal/field"
	"github.com/xaosmaker/server/internal/httpx"
	"github.com/xaosmaker/server/internal/job"
	middlewares "github.com/xaosmaker/server/internal/middleware"
	"github.com/xaosmaker/server/internal/season"
	"github.com/xaosmaker/server/internal/supply"
	usersetting "github.com/xaosmaker/server/internal/user_setting"
)

func MainRouter(con *pgxpool.Pool) *chi.Mux {

	config.CheckEnvs()

	authQ := auth.AuthQueries{
		DB: *db.New(con),
	}

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middlewares.TrailSlashErrorMiddleware)
	r.Use(authQ.AuthMiddleware)
	r.Post("/api/users/login", authQ.LoginUser)
	r.Post("/api/users/create", authQ.CreateUser)
	r.Post("/api/users/verify", authQ.VerifyUser)
	r.Post("/api/users/resendverify", authQ.ResendVefifyEmail)
	r.Mount("/api/farms", farm.FarmRouter(con))
	r.Mount("/api/fields", field.FieldRouter(con))
	r.Mount("/api/jobs", job.JobsRouter(con))
	r.Mount("/api/supplies", supply.SuppliesRouter(con))
	r.Mount("/api/settings", usersetting.UserSettingsRouter(con))
	r.Mount("/api/seasons", season.SeasonsRouter(con))
	r.NotFound(http.HandlerFunc(httpx.ServerError(404, httpx.NewErrMessage("Route not found", apperror.ROUTE_NOT_FOUND, nil))))
	r.MethodNotAllowed(http.HandlerFunc(httpx.ServerError(405, httpx.NewErrMessage("Method not found", apperror.METHOD_NOT_FOUND, nil))))
	return r
}
