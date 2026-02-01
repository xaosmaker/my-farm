package test

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestFieldC(t *testing.T) {
	noFieldUser := loginUserCookie("nofieldsuser@test.com", "test")

	cases := []struct {
		name    string
		cookie  Cookie
		method  string
		url     string
		body    string
		expCode int
		expBody []string
	}{

		// get all fields
		{"Get all fields empty should succeed", noFieldUser, "GET", "/api/fields", ``, 200, []string{`[]`}},
		{"Get all field should succeed", cookie, "GET", "/api/fields", ``, 200, []string{`[{"id":1,"name":"γουρουνια","epsg2100Boundary":null,"epsg4326Boundary":null,"mapLocation":null,"fieldLocation":"γουρουνια","areaInMeters":35000,"isOwned":false,"createdAt":"2026-10-11T00:00:00Z","updatedAt":"2026-10-11T00:00:00Z","landUnit":"m2"},`}},
		// create field
		{"Create field empty body should fail", cookie, "POST", "/api/fields", ``, 400, []string{`{"errors":[{"message":"name: Name is Required!","appCode":"required_field","meta":{"name":"name"}},{"message":"fieldLocation: FieldLocation should contain only chars spaces and number","appCode":"invalid_num_space_char","meta":null},{"message":"areaInMeters: AreaInMeters is Required!","appCode":"required_field","meta":{"name":"areaInMeters"}}]}`}},
		{"Create field with name should fail", cookie, "POST", "/api/fields", `{"name":"somename"}`, 400, []string{`{"errors":[{"message":"fieldLocation: FieldLocation should contain only chars spaces and number","appCode":"invalid_num_space_char","meta":null},{"message":"areaInMeters: AreaInMeters is Required!","appCode":"required_field","meta":{"name":"areaInMeters"}}]}`}},
		{"Create field with invalid data should fail", cookie, "POST", "/api/fields", `{"name":"somename!","fieldLocation":"some!","areaInMeters":"sfo"}`, 400, []string{`"errors":[{"message":"name: Name should contain only chars spaces and number","appCode":"invalid_num_space_char","meta":null},{"message":"fieldLocation: FieldLocation should contain only chars spaces and number","appCode":"invalid_num_space_char","meta":null},{"message":"areaInMeters: AreaInMeters is Required!","appCode":"required_field","meta":{"name":"areaInMeters"}}]}`}},
		{"Create field already exist should fail", cookie, "POST", "/api/fields", `{"name":"γουρουνια","fieldLocation":"some","areaInMeters":200}`, 409, []string{`{"errors":[{"message":"Field already exist","appCode":"exist_error","meta":{"name":"Field"}}]}`}},
		{"Create field should succeed", cookie, "POST", "/api/fields", `{"name":"somename","fieldLocation":"some","areaInMeters":200}`, 201, []string{`"id":`, `"name":"somename"`, `"epsg2100Boundary":null`, `"epsg4326Boundary":null`, `"mapLocation":null`, `"fieldLocation":"some"`, `"areaInMeters":200`, `"isOwned":false`, `"createdAt":"`, `"updatedAt":"`, `"landUnit":"m2"`}},
		{"Create field with same name diff user should succeed", noFieldUser, "POST", "/api/fields", `{"name":"somename","fieldLocation":"some","areaInMeters":200}`, 201, []string{``}},
		// update
		{"Update field of another user should fail", noFieldUser, "PATCH", "/api/fields/35", `{"name":"somename","fieldLocation":"some","areaInMeters":200}`, 404, []string{`{"errors":[{"message":"Field not found","appCode":"not_found_error","meta":{"name":"Field"}}]}`}},
		{"Update field should succeed", cookie, "PATCH", "/api/fields/25", `{"name":"somename1","fieldLocation":"some1","areaInMeters":201,"isOwned":true}`, 200, []string{`"id":`, `"name":"somename1"`, `"epsg2100Boundary":null`, `"epsg4326Boundary":null`, `"mapLocation":null`, `"fieldLocation":"some1"`, `"areaInMeters":201`, `"isOwned":true`, `"createdAt":"`, `"updatedAt":"`, `"landUnit":"m2"`}},
		{"Update field name already exist should fail", cookie, "PATCH", "/api/fields/25", `{"name":"γουρουνια"}`, 409, []string{`{"errors":[{"message":"Field already exist","appCode":"exist_error","meta":{"name":"Field"}}]}`}},
		{"Update field with string param should fail", cookie, "PATCH", "/api/fields/hello", ``, 400, []string{`{"errors":[{"message":"Invalid url param expect number","appCode":"invalid_url_param","meta":null}]}`}},
		{"Update field invalid name should fail", cookie, "PATCH", "/api/fields/25", `{"name":"some 1 @#"}`, 400, []string{`{"errors":[{"message":"name: Name should contain only chars spaces and number","appCode":"invalid_num_space_char","meta":null}]}`}},
		// get field
		{"Get field should succeed", cookie, "GET", "/api/fields/1", ``, 200, []string{`{"id":1,"name":"γουρουνια","epsg2100Boundary":null,"epsg4326Boundary":null,"mapLocation":null,"fieldLocation":"γουρουνια","areaInMeters":35000,"isOwned":false,"createdAt":"2026-10-11T00:00:00Z","updatedAt":"2026-10-11T00:00:00Z","landUnit":"m2"}`}},
		{"Get field dont exist should fail", cookie, "GET", "/api/fields/32", ``, 404, []string{`{"errors":[{"message":"Field not found","appCode":"not_found_error","meta":{"name":"Field"}}]}`}},
		{"Get field with string param should fail", cookie, "GET", "/api/fields/hello", ``, 400, []string{`{"errors":[{"message":"Invalid url param expect number","appCode":"invalid_url_param","meta":null}]}`}},
		// delete

		{"Delete field should succeed", cookie, "DELETE", "/api/fields/25", ``, 204, []string{``}},
		{"Delete field dont exist should fail", cookie, "DELETE", "/api/fields/32", ``, 404, []string{`{"errors":[{"message":"Field not found","appCode":"not_found_error","meta":{"name":"Field"}}]}`}},
		{"Delete field with string param should fail", cookie, "DELETE", "/api/fields/hello", ``, 400, []string{`{"errors":[{"message":"Invalid url param expect number","appCode":"invalid_url_param","meta":null}]}`}},
	}

	for _, c := range cases {

		t.Cleanup(func() {
			q, err := conn.Query(ctx, "delete from fields where name in ($1,$2);", "somename", "somename1")
			if err != nil {
				t.Fatal(err.Error())
			}
			q.Close()
		})

		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest(c.method, c.url, strings.NewReader(c.body))
			t.Log(c.url)
			req.Header.Set("Cookie", c.cookie)
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf("Expecting code: %d, got code: %d, with body: %v", c.expCode, res.Code, res.Body)
			}
			for _, body := range c.expBody {

				if !strings.Contains(res.Body.String(), body) {
					t.Fatalf("expecting %v contains %v", res.Body, body)
				}
			}

		})

	}
}
