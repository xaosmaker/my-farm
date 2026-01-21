package field

import (
	"context"
	"net/http/httptest"
	"testing"

	"github.com/xaosmaker/server/internal/db"
)

func TestFieldRouter(t *testing.T) {
	cases := []struct {
		name    string
		url     string
		mehtod  string
		expCode int
		expBody string
	}{
		{"test get withoy user", "/", "GET", 400, `{"status":400,"errors":[{"message":"User not found"}]}`},
		{"test get/{id} withoy user", "/1", "GET", 400, `{"status":400,"errors":[{"message":"User not found"}]}`},
		{"test post withoy user", "/", "POST", 400, `{"status":400,"errors":[{"message":"User not found"}]}`},
		{"test patch/{id} withoy user", "/1", "PATCH", 400, `{"status":400,"errors":[{"message":"User not found"}]}`},
		{"test delete/{id} withoy user", "/1", "DELETE", 400, `{"status":400,"errors":[{"message":"User not found"}]}`},
	}

	for _, c := range cases {
		ctx := context.Background()
		conn := db.ConnectDb(ctx)
		server := FieldRouter(conn)
		t.Cleanup(func() { conn.Close() })

		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest(c.mehtod, c.url, nil)
			res := httptest.NewRecorder()
			server.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf(`expecting code: %v, got: %v`, c.expCode, res.Code)
			}
			if res.Body.String() != c.expBody {
				t.Fatalf(`expecting body: %v, got: %v`, c.expBody, res.Body)
			}
		})

	}

}
