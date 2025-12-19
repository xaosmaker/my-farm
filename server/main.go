package main

import (
	"context"
	"github.com/xaosmaker/server/internal/auth"
	"github.com/xaosmaker/server/internal/config"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"log"
	"net/http"
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
	mux.HandleFunc("/", er.FieldErrors(400, nil))

	server := &http.Server{
		Addr:    ":8090",
		Handler: mux,
	}
	log.Fatal(server.ListenAndServe())
}
