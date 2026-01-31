package test

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestFarm(t *testing.T) {
	noFarmCookie := loginUserCookie("nofarmuser@test.com", "test")

	cases := []struct {
		name    string
		body    string
		method  string
		cookie  Cookie
		expCode int
		expBody []string
	}{

		// get farm
		{"Get farm no cookie should fail", ``, "GET", "some", 401, []string{`{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`}},
		{"Get farm farm dont exist should fail", ``, "GET", noFarmCookie, 404, []string{`{"errors":[{"message":"Farm not found","appCode":"not_found_error","meta":{"name":"Farm"}}]}`}},
		{"Get farm farm should succeed", ``, "GET", cookie, 200, []string{`"id":1`, `"name":"Δροσος Χωραφια"`, `"createdAt":"`, `"updatedAt":"`}},

		// create farm methods
		{"Create farm without body should fail", ``, "POST", cookie, 400, []string{`{"errors":[{"message":"name: Name is Required!","appCode":"required_field","meta":{"name":"name"}}]}`}},
		{"Create farm with empty name should fail", `{"name":""}`, "POST", cookie, 400, []string{`{"errors":[{"message":"name: Name is Required!","appCode":"required_field","meta":{"name":"name"}}]}`}},
		{"Create farm name contain symbols should fail", `{"name":"test1@"}`, "POST", cookie, 400, []string{`{"errors":[{"message":"name: Name should contain only chars spaces and number","appCode":"invalid_num_space_char","meta":null}]}`}},
		{"Create farm already exist should fail", `{"name":"test"}`, "POST", cookie, 409, []string{`{"errors":[{"message":"Farm already exist","appCode":"exist_error","meta":{"name":"Farm"}}]}`}},
		{"Create farm should succeed", `{"name":"test"}`, "POST", noFarmCookie, 201, []string{`"id":`, `"name":"test"`, `"createdAt":"`, `"updatedAt":"`}},
	}

	t.Cleanup(func() {
		q, err := conn.Query(ctx, `delete from farms where name = $1;`, "test")
		if err != nil {
			t.Fatal(err.Error())
		}
		q.Close()

	})
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {

			req := httptest.NewRequest(c.method, "/api/farms", strings.NewReader(c.body))
			req.Header.Set("Cookie", c.cookie)
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf("expected code: %d, got code: %d, with body: %s", c.expCode, res.Code, res.Body)
			}
			for _, body := range c.expBody {
				if !strings.Contains(res.Body.String(), body) {
					t.Fatalf("expecting %s to contain %s", res.Body, body)
				}
			}
		})
	}

}
