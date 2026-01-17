package main

import (
	"context"
	"log"
	"net/http"

	"github.com/xaosmaker/server/internal/app"
	"github.com/xaosmaker/server/internal/db"
)

func main() {
	ctx := context.Background()
	conn := db.ConnectDb(ctx)
	defer conn.Close()

	r := app.MainRouter(conn)

	server := &http.Server{

		Addr:    ":8090",
		Handler: r,
	}
	log.Fatal(server.ListenAndServe())
}
