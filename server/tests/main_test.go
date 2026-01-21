package tests

import (
	"context"
	"encoding/json"
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

var testServer *chi.Mux
var cookie string
var conn *pgxpool.Pool
var ctx context.Context

func createField(cookie string) fieldResponse {

	req := httptest.NewRequest("POST", "/api/fields", strings.NewReader(`{"name":"randomName","fieldLocation":"randomName","areaInMeters":35000}`))
	req.Header.Set("Cookie", cookie)
	res := httptest.NewRecorder()
	testServer.ServeHTTP(res, req)
	decoder := json.NewDecoder(res.Body)
	createdField := fieldResponse{}
	decoder.Decode(&createdField)
	if res.Code != 201 {
		log.Fatalf("Cannot create field to delete later")
	}
	return createdField
}

func setLandUnit(str, cookie string) error {
	req := httptest.NewRequest("POST", "/api/settings", strings.NewReader(fmt.Sprintf(`{"landUnit":"%s"}`, str)))
	req.Header.Set("Cookie", cookie)
	res := httptest.NewRecorder()
	testServer.ServeHTTP(res, req)
	if res.Code != 204 {
		return fmt.Errorf("Cant set the settings to: %s, body: %s, code: %d", str, res.Body, res.Code)
	}
	return nil
}
func loginUserCookie(email, password string) string {

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
func deleteField(fieldId any, cookie string) bool {

	req := httptest.NewRequest("DELETE", fmt.Sprintf("/api/fields/%v", fieldId), nil)
	req.Header.Set("Cookie", cookie)
	res := httptest.NewRecorder()
	testServer.ServeHTTP(res, req)
	return res.Code == 204
}

func toPtr[T any](val T) *T {
	return &val
}

func TestMain(m *testing.M) {
	ctx = context.Background()
	conn = db.ConnectDb(ctx)
	testServer = app.MainRouter(conn)
	cookie = loginUserCookie("test@test.com", "test")

	code := m.Run()

	conn.Close()

	os.Exit(code)
}
