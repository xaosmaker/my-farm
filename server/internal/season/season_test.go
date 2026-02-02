package season

import (
	"context"
	"net/http/httptest"
	"testing"

	"github.com/xaosmaker/server/internal/db"
)

func TestSeasonRouter(t *testing.T) {
	cases := []struct {
		name    string
		url     string
		mehtod  string
		expCode int
		expBody string
	}{
		{"test get withoy user", "/", "GET", 401, `{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`},
		{"test get/{id} withoy user", "/1", "GET", 401, `{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`},
		{"test get/{id}/{id} withoy user", "/1/details", "GET", 401, `{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`},
		{"test get/statistics/{id} withoy user", "/statistics/1", "GET", 401, `{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`},
		{"test post withoy user", "/1", "POST", 401, `{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`},
		{"test patch/{id} withoy user", "/1", "PATCH", 401, `{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`},
		{"test delete/{id} withoy user", "/1", "DELETE", 401, `{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`},
	}

	for _, c := range cases {
		ctx := context.Background()
		conn := db.ConnectDb(ctx)
		server := SeasonsRouter(conn)
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
