package test

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestSypply(t *testing.T) {

	noFieldUser := loginUserCookie("nofieldsuser@test.com", "test")
	// t.Cleanup(func() {
	// 	q, _ := conn.Query(ctx, `delete from supplies where name = $1;`, "somename1")
	// 	defer q.Close()
	// })
	cases := []struct {
		name    string
		method  string
		url     string
		cookie  Cookie
		body    string
		expCode int
		expBody []string
	}{
		// post
		{"Create Supply empty body should fail", "POST", "/api/supplies", cookie, ``, 400, []string{`"errors":[{"message":"supplyType: SupplyType is Required!","appCode":"required_field","meta":{"name":"supplyType"}},{"message":"name: Name is Required!","appCode":"required_field","meta":{"name":"name"}},{"message":"measurementUnit: MeasurementUnit is Required!","appCode":"required_field","meta":{"name":"measurementUnit"}}]}`}},
		{"Create Supply invalid params should fail", "POST", "/api/supplies", cookie, `{"supplyType":"soem","name":"sdf! @ ","measurementUnit":"okas"}`, 400, []string{`{"errors":[{"message":"supplyType: SupplyType should contain one of 'chemicals, fertilizers, seeds, diesel'","appCode":"invalid_supply_type","meta":{"oneof":"chemicals, fertilizers, seeds, diesel"}},{"message":"measurementUnit: MeasurementUnit should contain one of 'KG, L, piece'","appCode":"invalid_measurement_unit","meta":{"oneof":"KG, L, piece"}}]}`}},
		{"Create Supply should succeed", "POST", "/api/supplies", cookie, `{"supplyType":"chemicals","name":"somename","measurementUnit":"L"}`, 201, []string{`"id":`, `"supplyType":"chemicals"`, `"nickname":null`, `"name":"somename"`, `"measurementUnit":"L"`, `"createdAt":"`, `"updatedAt":"`}},
		{"Create Supply already exist should fail", "POST", "/api/supplies", cookie, `{"supplyType":"chemicals","name":"somename","measurementUnit":"L"}`, 409, []string{`{"errors":[{"message":"Supply already exist","appCode":"exist_error","meta":{"name":"Supply"}}]}`}},

		// update
		{"Update Supply empty body should fail", "PATCH", "/api/supplies/11", cookie, ``, 204, []string{``}},
		{"Update Supply invalid params should fail", "PATCH", "/api/supplies/11", cookie, `{"supplyType":"soem","name":"sdf! @ ","measurementUnit":"okas"}`, 400, []string{`{"errors":[{"message":"supplyType: SupplyType should contain one of 'chemicals, fertilizers, seeds, diesel'","appCode":"invalid_supply_type","meta":{"oneof":"chemicals, fertilizers, seeds, diesel"}},{"message":"measurementUnit: MeasurementUnit should contain one of 'KG, L, piece'","appCode":"invalid_measurement_unit","meta":{"oneof":"KG, L, piece"}}]}`}},
		{"Update Supply existing name should fail", "PATCH", "/api/supplies/11", cookie, `{"name":"DIVA"}`, 409, []string{`{"errors":[{"message":"Supply already exist","appCode":"exist_error","meta":{"name":"Supply"}}]}`}},
		{"Update Supply  should succeed", "PATCH", "/api/supplies/11", cookie, `{"name":"somename1","nickname":"xaos"}`, 204, []string{``}},
		{"Update Supply with id string should fail", "PATCH", "/api/supplies/ssss", cookie, `{"name":"somename1","nickname":"xaos"}`, 400, []string{`{"errors":[{"message":"Invalid url param expect number","appCode":"invalid_url_param","meta":null}]}`}},

		// get
		{"Get supplies dont exist should succeed", "GET", "/api/supplies", noFieldUser, ``, 200, []string{`[]`}},
		{"Get  should succeed", "GET", "/api/supplies", cookie, ``, 200, []string{`[{"id":8,"supplyType":"fertilizers","nickname":null,"name":"26-0-0","measurementUnit":"KG","createdAt":`}},

		// get details
		{"Get supplies should fail", "GET", "/api/supplies/sss", noFieldUser, ``, 400, []string{`{"errors":[{"message":"Invalid url param expect number","appCode":"invalid_url_param","meta":null}]}`}},
		{"Get supplies dont exist should fail", "GET", "/api/supplies/1", noFieldUser, ``, 404, []string{`{"errors":[{"message":"Supply dont exist","appCode":"not_found_error","meta":{"name":"Supply"}}]}`}},
		{"Get supplies should succeed", "GET", "/api/supplies/1", cookie, ``, 200, []string{`{"id":1`, `"supplyType":"chemicals","nickname":null,"name":"Akito","measurementUnit":"L","createdAt":"`, `"updatedAt":"`}},
		// delete supply
		{"Delete supply should fail", "DELETE", "/api/supplies/1", noFieldUser, ``, 404, []string{`{"errors":[{"message":"Supply dont exists","appCode":"not_found_error","meta":{"name":"Supply"}}]}`}},
		{"Delete supply with str param should fail", "DELETE", "/api/supplies/sss", noFieldUser, ``, 400, []string{`{"errors":[{"message":"Invalid url param expect number","appCode":"invalid_url_param","meta":null}]}`}},
		{"Delete supply should succeed", "DELETE", "/api/supplies/11", cookie, ``, 204, []string{``}},
	}

	for _, c := range cases {

		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest(c.method, c.url, strings.NewReader(c.body))
			req.Header.Set("Cookie", c.cookie)
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf("expected code: %d, got code: %d, with body: %s", c.expCode, res.Code, res.Body)
			}

			for _, body := range c.expBody {
				if !strings.Contains(res.Body.String(), body) {
					t.Fatalf("expected %v to contain %v", res.Body, body)
				}
			}
		})
	}

}
