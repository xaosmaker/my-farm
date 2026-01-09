package main

import (
	"context"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/xaosmaker/server/internal/auth"
	"github.com/xaosmaker/server/internal/config"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/farm"
	"github.com/xaosmaker/server/internal/field"
	"github.com/xaosmaker/server/internal/httpx"
	"github.com/xaosmaker/server/internal/jobs"
	"github.com/xaosmaker/server/internal/middlewares"
	"github.com/xaosmaker/server/internal/supplies"
	usersettings "github.com/xaosmaker/server/internal/user_settings"
)

func main() {
	config.CheckEnvs()

	ctx := context.Background()
	conn := db.ConnectDb(ctx)
	defer conn.Close()
	authQ := auth.AuthQueries{
		DB: *db.New(conn),
	}

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middlewares.TrailSlashErrorMiddleware)
	r.Use(authQ.AuthMiddleware)
	r.Post("/api/users/login", authQ.LoginUser)
	r.Post("/api/users/create", authQ.CreateUser)
	r.Mount("/api/farms", farm.FarmRouter(conn))
	r.Mount("/api/fields", field.FieldRouter(conn))
	r.Mount("/api/jobs", jobs.JobsRouter(conn))
	r.Mount("/api/supplies", supplies.SuppliesRouter(conn))
	r.Mount("/api/settings", usersettings.UserSettingsRouter(conn))
	r.NotFound(http.HandlerFunc(httpx.GeneralError(404, "Route not Found")))
	r.MethodNotAllowed(http.HandlerFunc(httpx.GeneralError(405, "Method not found ")))

	server := &http.Server{

		Addr:    ":8090",
		Handler: r,
	}
	log.Fatal(server.ListenAndServe())
}
