package tests

import (
	"context"
	"fmt"
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

func setLandUnit(str string) error {
	req := httptest.NewRequest("POST", "/api/settings", strings.NewReader(fmt.Sprintf(`{"landUnit":"%s"}`, str)))
	req.Header.Set("Cookie", cookie)
	res := httptest.NewRecorder()
	testServer.ServeHTTP(res, req)
	if res.Code != 204 {
		return fmt.Errorf("Cant set the settings to: %s, body: %s, code: %d", str, res.Body, res.Code)
	}
	return nil
}
func toPtr[T any](val T) *T {
	return &val
}

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
