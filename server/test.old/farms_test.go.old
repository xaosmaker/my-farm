package test

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestFarmsApi(t *testing.T) {
	noFarmCookie := loginUserCookie("nofarmuser@test.com", "test")

	cases := []struct {
		name       string
		withCookie *string
		expCode    int
		expBody    string
	}{
		{"req without cookie", nil, 401, `{"status":401,"errors":[{"message":"Login to continue"}]}`},
		{"get farm", &cookie, 200, `{"id":1,"name":"Δροσος Χωραφια","createdAt":"2025-09-11T10:00:00Z","updatedAt":"2025-09-11T10:00:00Z"}`},
		{"get not existing farm", &noFarmCookie, 400, `{"status":400,"errors":[{"message":"Create a farm before continue"}]}`},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {

			req := httptest.NewRequest("GET", "/api/farms", nil)
			if c.withCookie != nil {
				req.Header.Set("Cookie", *c.withCookie)
			}

			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf("expected code: %d, got: %d, with body: %s", c.expCode, res.Code, res.Body.String())

			}
			if res.Body.String() != c.expBody {
				t.Fatalf("expected body: %s, got: %s", c.expBody, res.Body)
			}

		})
	}

}

func TestFarmCreateFarmApi(t *testing.T) {

	noFarmCookie := loginUserCookie("nofarmuser@test.com", "test")
	cases := []struct {
		name    string
		cookie  string
		reqBody string
		expCode int
		expBody []string
	}{
		{"create farm . should succeed", noFarmCookie, `{"name":"farm"}`, 201, []string{`"id":`, `"name":"farm"`, `"createdAt":"`, `"updatedAt":"`}},
		{"create farm already exists", cookie, `{"name":"My Farm"}`, 400, []string{`{"status":400,"errors":[{"message":"Farm already Exist cannot create another"}]}`}},
		{"create farm without name", cookie, `{}`, 400, []string{`{"status":400,"errors":[{"message":"name: Name is Required!"}]}`}},
		{"create farm empty name", cookie, `{"name":""}`, 400, []string{`{"status":400,"errors":[{"message":"name: Name is Required!"}]}`}},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {

			req := httptest.NewRequest("POST", "/api/farms", strings.NewReader(c.reqBody))
			req.Header.Set("Cookie", c.cookie)

			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)
			t.Cleanup(func() {
				if strings.HasPrefix(c.name, "create farm .") {
					var id string
					for line := range strings.SplitSeq(res.Body.String(), ",") {

						if strings.Contains(line, "id") {
							id = strings.Split(line, ":")[1]
						}
					}
					q, err := conn.Query(ctx, `delete from farms where id = $1;`, id)
					q.Close()
					if err != nil {
						t.Fatal(err)
					}
				}
			})

			if res.Code != c.expCode {
				t.Fatalf("expected code: %d, got: %d, with body: %s", c.expCode, res.Code, res.Body.String())
			}
			strBody := res.Body.String()
			for _, exp := range c.expBody {
				if !strings.Contains(strBody, exp) {
					t.Fatalf("expected body: %s, got: %s", c.expBody, exp)
				}

			}

		})
	}

}
