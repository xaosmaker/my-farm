package test

import (
	"context"
	"fmt"
	"log"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xaosmaker/server/internal/app"
	"github.com/xaosmaker/server/internal/db"
)

type Cookie = string

var conn *pgxpool.Pool
var ctx context.Context
var testServer *chi.Mux
var cookie Cookie

func TestMain(m *testing.M) {
	ctx = context.Background()
	conn = db.ConnectDb(ctx)
	testServer = app.MainRouter(conn)
	cookie = loginUserCookie("test@test.com", "test")

	code := m.Run()

	conn.Close()

	os.Exit(code)
}

func loginUserCookie(email, password string) Cookie {

	body := fmt.Sprintf(`{"email":"%v", "password":"%v"}`, email, password)
	req := httptest.NewRequest("POST", "/api/users/login", strings.NewReader(body))
	res := httptest.NewRecorder()
	testServer.ServeHTTP(res, req)
	c := res.Header().Get("Set-Cookie")
	if c == "" {
		log.Fatal("no cookie found")
	}
	return c
}
