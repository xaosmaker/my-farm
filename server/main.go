package main

import (
	"context"
	"log"
	"net/http"

	"github.com/xaosmaker/server/internal/auth"
	"github.com/xaosmaker/server/internal/config"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/farm"
)

func main() {
	config.CheckEnvs()

	ctx := context.Background()
	conn := db.ConnectDb(ctx)
	defer conn.Close()
	authQ := auth.AuthQueries{
		DB: *db.New(conn),
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/users/login", authQ.LoginUser)
	mux.Handle("/api/", http.StripPrefix("/api", farm.FarmRouter(conn)))
	mux.HandleFunc("/", er.FieldErrors(400, nil))

	server := &http.Server{
		Addr:    ":8090",
		Handler: authQ.AuthMiddleware(mux),
	}
	log.Fatal(server.ListenAndServe())
}
