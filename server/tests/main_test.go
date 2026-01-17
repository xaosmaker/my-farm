package tests

import (
	"context"
	"os"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/xaosmaker/server/internal/app"
	"github.com/xaosmaker/server/internal/db"
)

var testServer *chi.Mux

func TestMain(m *testing.M) {
	ctx := context.Background()
	conn := db.ConnectDb(ctx)
	testServer = app.MainRouter(conn)
	code := m.Run()

	conn.Close()

	os.Exit(code)
}
