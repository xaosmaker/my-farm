package test

import (
	"net/http/httptest"
	"testing"
)

func TestTrailingSlashMiddleware(t *testing.T) {
	req := httptest.NewRequest("GET", "/api/users/login/", nil)
	res := httptest.NewRecorder()

	testServer.ServeHTTP(res, req)
	if res.Code != 400 {
		t.Fatalf("expected code: %d, got: %d, with body: %s", 200, res.Code, res.Body.String())
	}
	resBody := `{"status":400,"errors":[{"message":"Url cannot end on /"}]}`
	if resBody != res.Body.String() {
		t.Fatalf("expected: %v, got: %s", res.Body, res.Body.String())
	}

}
