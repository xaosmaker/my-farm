package tests

import (
	"context"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/xaosmaker/server/internal/app"
	"github.com/xaosmaker/server/internal/db"
)

var testServer *chi.Mux
var cookie string

func TestMain(m *testing.M) {
	ctx := context.Background()
	conn := db.ConnectDb(ctx)
	testServer = app.MainRouter(conn)
	req := httptest.NewRequest("POST", "/api/users/login", strings.NewReader(`{"email":"test@test.com", "password":"test"}`))
	res := httptest.NewRecorder()
	testServer.ServeHTTP(res, req)
	cookie = res.Header().Get("Set-Cookie")

	code := m.Run()

	conn.Close()

	os.Exit(code)
}
