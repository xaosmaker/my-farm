package main

import (
	"context"
	"github.com/xaosmaker/server/internal/config"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/users"
	"log"
	"net/http"
)

func main() {
	config.CheckEnvs()

	ctx := context.Background()
	conn := db.ConnectDb(ctx)
	defer conn.Close()

	mux := http.NewServeMux()
	mux.Handle("/api/", http.StripPrefix("/api", users.UserMux(conn)))
	mux.HandleFunc("/", er.FieldErrors(400, nil))

	server := &http.Server{
		Addr:    ":8090",
		Handler: mux,
	}
	log.Fatal(server.ListenAndServe())
}
