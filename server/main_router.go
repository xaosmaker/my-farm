package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/auth"
	"github.com/xaosmaker/server/internal/config"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/farm"
	"github.com/xaosmaker/server/internal/field"
	"github.com/xaosmaker/server/internal/httpx"
	"github.com/xaosmaker/server/internal/jobs"
	"github.com/xaosmaker/server/internal/middlewares"
	"github.com/xaosmaker/server/internal/seasons"
	"github.com/xaosmaker/server/internal/supplies"
	usersettings "github.com/xaosmaker/server/internal/user_settings"
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
	r.Mount("/api/farms", farm.FarmRouter(con))
	r.Mount("/api/fields", field.FieldRouter(con))
	r.Mount("/api/jobs", jobs.JobsRouter(con))
	r.Mount("/api/supplies", supplies.SuppliesRouter(con))
	r.Mount("/api/settings", usersettings.UserSettingsRouter(con))
	r.Mount("/api/seasons", seasons.SeasonsRouter(con))
	r.NotFound(http.HandlerFunc(httpx.GeneralError(404, "Route not Found")))
	r.MethodNotAllowed(http.HandlerFunc(httpx.GeneralError(405, "Method not found ")))
	return r
}
