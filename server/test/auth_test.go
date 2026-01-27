package test

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestLogin(t *testing.T) {
	cases := []struct {
		name    string
		body    string
		expCode int
		expBody []string
	}{
		{"login without body should fail", ``, 400, []string{`{"errors":[{"message":"email: Email is Required!","appCode":"required_field","meta":null},{"message":"password: Password is Required!","appCode":"required_field","meta":null}]}`}},
		{"login without password should fail", `{"email":"test@test.com"}`, 400, []string{`{"errors":[{"message":"password: Password is Required!","appCode":"required_field","meta":null}]}`}},
		{"login with wrong email should fail", `{"email":"test123@test.com","password":"wrongPass"}`, 401, []string{`{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`}},
		{"login with wrong password should fail", `{"email":"test@test.com","password":"wrongPass"}`, 401, []string{`{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`}},
		{"login should succeed", `{"email":"test@test.com","password":"test"}`, 200, []string{`{"id":1,"email":"test@test.com","farmId":1,"farmName":"Δροσος Χωραφια"}`}},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/api/users/login", strings.NewReader(c.body))
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf("expecting Code: %d, got Code: %d", c.expCode, res.Code)
			}

			resBody := res.Body.String()
			for _, inBody := range c.expBody {
				if !strings.Contains(resBody, inBody) {
					t.Fatalf("expecting %s contain %s", resBody, inBody)

				}
			}
		})
	}
}
