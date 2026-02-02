package test

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestUserSetting(t *testing.T) {
	nosettingCookie := loginUserCookie("nosettingsuser@test.com", "test")
	cases := []struct {
		name    string
		method  string
		cookie  Cookie
		body    string
		expCode int
		expBody []string
	}{
		//get
		{"get settings should succeed", "GET", cookie, ``, 200, []string{`{"id":1,"userId":1,"landUnit":"m2","createdAt":"`, `"updatedAt":"`}},
		{"get settings should fail", "GET", nosettingCookie, ``, 401, []string{`{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`}},
		// post

		{"Update settings empty body should fail", "POST", cookie, ``, 400, []string{`{"errors":[{"message":"landUnit: LandUnit is Required!","appCode":"required_field","meta":{"name":"landUnit"}}]}`}},
		{"Update settings wrong values should fail", "POST", cookie, `{"landUnit":"hello"}`, 400, []string{`{"errors":[{"message":"landUnit: LandUnit should contain one of 'stremata, hectares, m2'","appCode":"invalid_land_unit","meta":{"oneof":"stremata, hectares, m2"}}]}`}},
		{"Update settings should succeed", "POST", cookie, `{"landUnit":"hectares"}`, 204, []string{``}},

		{"get settings with changed value should succeed", "GET", cookie, ``, 200, []string{`{"id":1,"userId":1,"landUnit":"hectares","createdAt":"`, `"updatedAt":"`}},

		{"Update settings to stremata should succeed", "POST", cookie, `{"landUnit":"stremata"}`, 204, []string{``}},
		{"get settings with stremata changed value should succeed", "GET", cookie, ``, 200, []string{`{"id":1,"userId":1,"landUnit":"stremata","createdAt":"`, `"updatedAt":"`}},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest(c.method, "/api/settings", strings.NewReader(c.body))
			req.Header.Set("Cookie", c.cookie)
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf("expected code: %d, got code: %d, with body %s", c.expCode, res.Code, res.Body)
			}
			for _, body := range c.expBody {
				if !strings.Contains(res.Body.String(), body) {
					t.Fatalf("expectd %s to contail %s", res.Body, body)

				}
			}

		})
	}

}
