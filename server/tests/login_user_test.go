package tests

import (
	"net/http/httptest"
	"strings"
	"testing"
)

/*
capture cookie
validate cookie
*/

func TestLoginUser(t *testing.T) {
	cases := []struct {
		name    string
		reqBody string
		expCode int
		expBody string
	}{
		{"successfull login", `{"email":"test@test.com", "password":"test"}`, 200, `{"id":1,"email":"test@test.com","farmId":1,"farmName":"Δροσος Χωραφια"}`},
		{"not exist email", `{"email":"test1@test.com", "password":"test"}`, 401, `{"status":401,"errors":[{"message":"Invalid Credentials"}]}`},
		{"wrong password", `{"email":"test@test.com", "password":"test1"}`, 401, `{"status":401,"errors":[{"message":"Invalid Credentials"}]}`},
		{"email field missing", `{"password":"test"}`, 400, `{"status":400,"errors":[{"message":"email: Email is Required!"}]}`},
		{"password field missing", `{"email":"test1@test.com"}`, 400, `{"status":400,"errors":[{"message":"password: Password is Required!"}]}`},
		{"empty body", `{}`, 400, `{"status":400,"errors":[{"message":"email: Email is Required!"},{"message":"password: Password is Required!"}]}`},
		{"empty password", `{"email":"test@test.com", "password":""}`, 400, `{"status":400,"errors":[{"message":"password: Password is Required!"}]}`},
		{"empty email", `{"email":"","password":"test"}`, 400, `{"status":400,"errors":[{"message":"email: Email is Required!"}]}`},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/api/users/login", strings.NewReader(c.reqBody))
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf("expected code: %d, got: %d, with body: %s", c.expCode, res.Code, res.Body.String())
			}
			if c.expBody != res.Body.String() {
				t.Fatalf("expected %v, got%s", c.expBody, res.Body.String())

			}

		})

	}
}

func TestLoginUserCookieExist(t *testing.T) {

	req := httptest.NewRequest("POST", "/api/users/login", strings.NewReader(`{"email":"test@test.com", "password":"test"}`))
	res := httptest.NewRecorder()
	testServer.ServeHTTP(res, req)
	if res.Code != 200 {
		t.Fatalf("expected code: %d, got: %d, with body: %s", 200, res.Code, res.Body.String())
	}

	cookie := res.Header().Get("Set-Cookie")
	if !strings.HasPrefix(cookie, "access") {
		t.Fatalf("cookie donnot have prefix access: %s", cookie)
	}

}
