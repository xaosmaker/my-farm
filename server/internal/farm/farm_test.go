package farm

import (
	"context"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/xaosmaker/server/internal/db"
)

func TestFarmRouter(t *testing.T) {

	cases := []struct {
		name    string
		url     string
		mehtod  string
		expCode int
		expBody string
	}{
		{"test farm post without user", "/", "POST", 401, `{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`},
	}

	for _, c := range cases {
		ctx := context.Background()
		conn := db.ConnectDb(ctx)
		server := FarmRouter(conn)
		t.Cleanup(func() { conn.Close() })

		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest(c.mehtod, c.url, nil)
			res := httptest.NewRecorder()
			server.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf(`expecting code: %v, got: %v`, c.expCode, res.Code)
			}
			if !strings.Contains(res.Body.String(), c.expBody) {
				t.Fatalf(`expecting body: %v, got: %v`, c.expBody, res.Body)
			}
		})

	}

}
