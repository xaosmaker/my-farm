package test

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestJob(t *testing.T) {
	noFieldUser := loginUserCookie("nofieldsuser@test.com", "test")

	cases := []struct {
		name    string
		method  string
		url     string
		cookie  Cookie
		body    string
		expCode int
		expBody []string
	}{
		// GET
		{"Get Jobs with seasonId string should fail", "GET", "/api/jobs/sdfa", cookie, ``, 400, []string{`{"errors":[{"message":"Invalid url param expect number","appCode":"invalid_url_param","meta":null}]}`}},
		{"Get Jobs with seasonId not exist should fail", "GET", "/api/jobs/1", noFieldUser, ``, 404, []string{`{"errors":[{"message":"Farm not found","appCode":"not_found_error","meta":{"name":"Farm"}}]}`}},
		{"Get Jobs with seasonId should succeed", "GET", "/api/jobs/1", cookie, ``, 200, []string{`[{`, `"id":5`, `"jobType":"harvesting"`, `"description":"fertilizing one or many doent mater"`, `"seasonId":1`, `"jobDate":"`, `"areaInMeters":35000`, `"boundary":null`, `"landUnit":"m2"`, `"createdAt":"`, `"updatedAt":"`, `"jobsSupplies":[{"id":9,"quantity":35040,"jobId":5`, `"createdAt":"`, `"updatedAt":"`, `"supplyName":"DIVA","supplyAlias":null,"supplyId":10,"supplyMeasurementUnit":"KG"}]`, `}]`}},
		// create job
		{"Create Jobs empty body should fail", "POST", "/api/jobs", cookie, ``, 400, []string{`{"errors":[{"message":"jobType: JobType is Required!","appCode":"required_field","meta":{"name":"jobType"}},{"message":"jobDate: JobDate is Required!","appCode":"required_field","meta":{"name":"jobDate"}},{"message":"seasonId: SeasonID is Required!","appCode":"required_field","meta":{"name":"seasonId"}},{"message":"fieldId: FieldID is Required!","appCode":"required_field","meta":{"name":"fieldId"}},{"message":"areaInMeters: AreaInMeters is Required!","appCode":"required_field","meta":{"name":"areaInMeters"}},{"message":"jobSupplies: JobSupplies is Required!","appCode":"required_field","meta":{"name":"jobSupplies"}}]}`}},
		{"Create Jobs empty job supplies should fail", "POST", "/api/jobs", cookie, `{"fieldId":11,"seasonId":1,"areaInMeters": 22,"jobDate":"2025-11-12T11:11:11Z","jobType":"spraying","jobSupplies":[]}`, 400, []string{`{"errors":[{"message":"JobSupplies us required","appCode":"required_field","meta":{"name":"JobSupplies"}}]}`}},
		{"Create Jobs with job supplies wrong data should fail", "POST", "/api/jobs", cookie, `{"fieldId":11,"seasonId":1,"areaInMeters": 22,"jobDate":"2025-11-12T11:11:11Z","jobType":"spraying","jobSupplies":[{}]}`, 400, []string{`{"errors":[{"message":"quantity: Quantity is Required!","appCode":"required_field","meta":{"name":"quantity"}},{"message":"supplyId: SupplyID is Required!","appCode":"required_field","meta":{"name":"supplyId"}}]}`}},
		{"Create Jobs before season start should fail", "POST", "/api/jobs", cookie, `{"fieldId":1,"seasonId":1,"areaInMeters": 22,"jobDate":"2024-11-12T11:11:11Z","jobType":"spraying","jobSupplies":[{"quantity": 200,"supplyId": 3},{"quantity": 0.2,"supplyId": 1}]}`, 400, []string{`{"errors":[{"message":"Cannot add job before the season start","appCode":"invalid_job_start","meta":{"max":"2025-05-11 22:00:00 +0000 UTC"}}]}`}},

		{"Create Jobs should succeed", "POST", "/api/jobs", cookie, `{"fieldId":1,"seasonId":1,"areaInMeters": 22,"jobDate":"2025-05-11T23:11:11Z","jobType":"spraying","jobSupplies":[{"quantity": 200,"supplyId": 3},{"quantity": 0.2,"supplyId": 1}]}`, 400, []string{`{"ID":6,"JobType":"spraying","Description":null,"JobDate":"`, `"AreaInMeters":22,"Boundary":null,"SeasonID":1,"CreatedAt":"`, `"UpdatedAt":"`, `"DeletedAt":null}`}},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest(c.method, c.url, strings.NewReader(c.body))
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
