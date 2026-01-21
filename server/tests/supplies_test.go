package tests

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCreateSupply(t *testing.T) {
	cases := []struct {
		name    string
		body    string
		cookie  string
		expCode int
		expBody []string
	}{
		{"create supply empty body should fail", ``, cookie, 400, []string{`{"status":400,"errors":[{"message":"supplyType: SupplyType is Required!"},{"message":"name: Name is Required!"},{"message":"measurementUnit: MeasurementUnit is Required!"}]}`}},
		{"create supply name in body should fail", `{"name":"name"}`, cookie, 400, []string{`{"status":400,"errors":[{"message":"supplyType: SupplyType is Required!"},{"message":"measurementUnit: MeasurementUnit is Required!"}]}`}},
		{"create supply name, supplyType wrong type in body should fail", `{"name":"name","supplyType":"test"}`, cookie, 400, []string{`{"status":400,"errors":[{"message":"supplyType: SupplyType should contain one of 'chemicals, fertilizers, seeds, diesel'"},{"message":"measurementUnit: MeasurementUnit is Required!"}]}`}},
		{"create supply name,supplyType in body should fail", `{"name":"name","supplyType":"chemicals"}`, cookie, 400, []string{`{"status":400,"errors":[{"message":"measurementUnit: MeasurementUnit is Required!"}]}`}},
		{"create supply name,supplyType and measurementUnit wrong type in body should fail", `{"name":"name","supplyType":"chemicals","measurementUnit":"gr"}`, cookie, 400, []string{`{"status":400,"errors":[{"message":"measurementUnit: MeasurementUnit should contain one of 'KG, L, piece'"}]}`}},
		{"create supply should succeed", `{"name":"name","nickname":"test","supplyType":"chemicals","measurementUnit":"L"}`, cookie, 201, []string{`"id":`, `"supplyType":"chemicals"`, `"nickname":"test"`, `"name":"name"`, `"measurementUnit":"L"`, `"createdAt":"`, `"updatedAt":"`}},
		{"create supply with same name  should fail", `{"name":"name","nickname":"test","supplyType":"chemicals","measurementUnit":"L"}`, cookie, 400, []string{`{"status":400,"errors":[{"message":"Name Already Exists"}]}`}},
	}

	for _, c := range cases {
		t.Cleanup(func() {
			q, _ := conn.Query(ctx, "delete from supplies where name = $1", "name")
			q.Close()

		})
		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/api/supplies", strings.NewReader(c.body))
			req.Header.Set("Cookie", cookie)
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf("expecting code: %v, got %v, with body: %v", c.expCode, res.Code, res.Body)
			}

			strBody := res.Body.String()
			for _, body := range c.expBody {
				if !strings.Contains(strBody, body) {
					t.Fatalf("%v in %v", c.body, strBody)

				}

			}

		})
	}
}
