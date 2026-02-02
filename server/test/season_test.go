package test

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestSeaonsGetAllActive(t *testing.T) {
	noFieldUserCookie := loginUserCookie("nofieldsuser@test.com", "test")
	cases := []struct {
		name    string
		method  string
		url     string
		cookie  Cookie
		body    string
		expCode int
		expBody []string
	}{
		// get all Active seasons
		{"get all active seasons should succeed", "GET", "/api/seasons", cookie, ``, 200, []string{`[{"id":1,"fieldId":1,"name":"season 2025","startSeason":"2025-05-11T22:00:00Z","finishSeason":null,"crop":10,"boundary":null,"areaInMeters":35000,"createdAt":"`, `"updatedAt":"`, `"landUnit":"m2","cropName":"DIVA","fieldName":"γουρουνια","fieldAreaInMeters":35000}]`}},
		{"get all active seasons should succeed", "GET", "/api/seasons", noFieldUserCookie, ``, 200, []string{`[]`}},

		// update
		{"update season with string url param should fail", "PATCH", "/api/seasons/sss", cookie, `{"startSeason":"2025-05-13T22:00:00Z"}`, 400, []string{`{"errors":[{"message":"Invalid url param expect number","appCode":"invalid_url_param","meta":null}]}`}},
		{"update season with start of time after first job should fail", "PATCH", "/api/seasons/1", cookie, `{"startSeason":"2025-05-13T22:00:00Z"}`, 400, []string{`{"errors":[{"message":"The Date to start season must be lower of the first job: lower Than 2025-05-10T22:00:00Z","appCode":"invalid_season_start_date","meta":{"date":"2025-05-10T22:00:00Z","dateLimit":"lower"}}]}`}},
		{"update season with areaInmeter greater than field area should fail", "PATCH", "/api/seasons/1", cookie, `{"areaInMeters":55000}`, 400, []string{`{"errors":[{"message":"No area to cultivate, remaining area: 0.00","appCode":"invalid_season_area","meta":{"area":"0.00"}}]}`}},
		{"update season dont exist should fail", "PATCH", "/api/seasons/25", cookie, `{"startSeason":"2025-05-13T22:00:00Z"}`, 404, []string{`{"errors":[{"message":"Season not found","appCode":"not_found_error","meta":{"name":"Season"}}]}`}},
		{"update season finish season before last job should fail", "PATCH", "/api/seasons/1", cookie, `{"finishSeason":"2025-05-09T22:00:00Z"}`, 400, []string{`{"errors":[{"message":"The Date to finish season must be greater of the last job: greater Than 2025-09-11 22:00:00 +0000 UTC","appCode":"invalid_season_finish_date","meta":{"date":"2025-09-11T22:00:00Z","dateLimit":"greater"}}]}`}},
		{"update season finish should succeed", "PATCH", "/api/seasons/1", cookie, `{"finishSeason":"2025-12-02T22:00:00Z"}`, 204, []string{``}},
		{"update season wrong data  should fail", "PATCH", "/api/seasons/1", cookie, `{"finishSeason":"2025-02T22:00:00Z"}`, 400, []string{`{"errors":[{"message":"finishSeason: FinishSeason should be of format '2026-01-13T02:12:00.000Z'","appCode":"invalid_timestamp","meta":{"format":"'2026-01-13T02:12:00.000Z'"}}]}`}},

		// create
		{"Create season empty body should fail", "POST", "/api/seasons/1", cookie, ``, 400, []string{`{"errors":[{"message":"name: Name is Required!","appCode":"required_field","meta":{"name":"name"}},{"message":"startSeason: StartSeason is Required!","appCode":"required_field","meta":{"name":"startSeason"}},{"message":"crop: Crop is Required!","appCode":"required_field","meta":{"name":"crop"}},{"message":"areaInMeters: AreaInMeters is Required!","appCode":"required_field","meta":{"name":"areaInMeters"}}]}`}},
		{"Create season wrong params should fail", "POST", "/api/seasons/1", cookie, `{"name":"test!","startSeason":"soem","crop":"1","areaInMeters":"sss"}`, 400, []string{`{"errors":[{"message":"name: Name should contain only chars spaces and number","appCode":"invalid_num_space_char","meta":null},{"message":"startSeason: StartSeason should be of format '2026-01-13T02:12:00.000Z'","appCode":"invalid_timestamp","meta":{"format":"'2026-01-13T02:12:00.000Z'"}},{"message":"crop: Crop is Required!","appCode":"required_field","meta":{"name":"crop"}},{"message":"areaInMeters: AreaInMeters is Required!","appCode":"required_field","meta":{"name":"areaInMeters"}}]}`}},
		{"Create season string id should fail", "POST", "/api/seasons/sss", cookie, ``, 400, []string{`{"errors":[{"message":"Invalid url param expect number","appCode":"invalid_url_param","meta":null}]}`}},
		{"Create season field dont exist should fail", "POST", "/api/seasons/1", noFieldUserCookie, `{"name":"test","startSeason":"2025-12-02T22:00:00Z","crop":1,"areaInMeters":35000}`, 404, []string{`{"errors":[{"message":"Field not found","appCode":"not_found_error","meta":{"name":"Field"}}]}`}},
		{"Create season start season before prev season should fail", "POST", "/api/seasons/1", cookie, `{"name":"test","startSeason":"2025-08-02T22:00:00Z","crop":1,"areaInMeters":35000}`, 400, []string{`{"errors":[{"message":"season can't start before the previous season!  season should start after 2025-12-02T22:00:00Z","appCode":"invalid_season_start_date","meta":{"date":"2025-12-02T22:00:00Z","dateLimit":"greater"}}]}`}},
		{"Create season area bigget than the field season should fail", "POST", "/api/seasons/1", cookie, `{"name":"test","startSeason":"2025-12-03T22:00:00Z","crop":1,"areaInMeters":65000}`, 400, []string{`{"errors":[{"message":"No area to cultivate, remaining area: 35000.00","appCode":"invalid_season_area","meta":{"area":"35000.00"}}]}`}},
		{"Create season should succeed", "POST", "/api/seasons/1", cookie, `{"name":"test","startSeason":"2025-12-03T22:00:00Z","crop":1,"areaInMeters":35000}`, 201, []string{``}},
		// update continue the test with the new created season

		{"update season finish season should fail", "PATCH", "/api/seasons/1", cookie, `{"finishSeason":"2025-12-02T22:00:00Z"}`, 400, []string{`{"errors":[{"message":"Cannot Edit season when a season is finished","appCode":"season_finish_error","meta":null}]}`}},
		{"update season startSeason before the prev season should fail", "PATCH", "/api/seasons/2", cookie, `{"startSeason":"2025-08-02T22:00:00Z"}`, 400, []string{`{"errors":[{"message":"season can't start before the previous season!  season should start after 2025-12-02T22:00:00Z","appCode":"invalid_season_start_date","meta":{"date":"2025-12-02T22:00:00Z","dateLimit":"greater"}}]}`}},
		{"update season startSeason before the prev season should fail", "PATCH", "/api/seasons/2", cookie, `{"startSeason":"2025-12-05T22:00:00Z","finishSeason":"2025-12-03T22:00:00Z"}`, 400, []string{`{"errors":[{"message":"The Date to finish season must be greater of the last job: greater Than 2025-12-05T22:00:00Z","appCode":"invalid_season_finish_date","meta":{"date":"2025-12-05T22:00:00Z","dateLimit":"greater"}}]}`}},
		// get all season for a field
		{"Get all seasons for a field should succeed", "GET", "/api/seasons/1", cookie, ``, 200, []string{`[{"id":2,"fieldId":1,"name":"test","startSeason":"2025-12-03T22:00:00Z","finishSeason":null,"crop":1,"boundary":null,`, `"fieldName":"γουρουνια","fieldAreaInMeters":35000}]`}},
		{"Get all seasons for a field without seasons should succeed", "GET", "/api/seasons/5", cookie, ``, 200, []string{`[]`}},
		{"Get all seasons with sstr param  should fail", "GET", "/api/seasons/sss", cookie, ``, 400, []string{`{"errors":[{"message":"Invalid url param expect number","appCode":"invalid_url_param","meta":null}]}`}},
		{"Get all seasons for a not existing field should fail", "GET", "/api/seasons/124", cookie, ``, 404, []string{`{"errors":[{"message":"Field does not exist","appCode":"not_found_error","meta":{"name":"Field"}}]}`}},
		// get details
		{"Get season details should succeed", "GET", "/api/seasons/1/details", cookie, ``, 200, []string{`{"id":1,"fieldId":1,"name":"season 2025","startSeason":"2025-05-11T22:00:00Z","finishSeason":"2025-12-02T22:00:00Z","crop":10,"boundary":null,"areaInMeters":35000,"createdAt":"`, `"updatedAt":"`, `"landUnit":"m2","cropName":"DIVA","fieldName":"γουρουνια","fieldAreaInMeters":35000}`}},
		{"Get season details with str fieldid should fail", "GET", "/api/seasons/sss/details", cookie, ``, 400, []string{`{"errors":[{"message":"Invalid url param expect number","appCode":"invalid_url_param","meta":null}]}`}},
		{"Get season details not existing season should fail", "GET", "/api/seasons/124/details", cookie, ``, 404, []string{`{"errors":[{"message":"Season not found","appCode":"not_found_error","meta":{"name":"Season"}}]}`}},
		// delete season
		{"Delete seasons wiht str is  should fail", "DELETE", "/api/seasons/sfafd", cookie, ``, 400, []string{`{"errors":[{"message":"Invalid url param expect number","appCode":"invalid_url_param","meta":null}]}`}},
		{"Delete not existing season should fail", "DELETE", "/api/seasons/2", noFieldUserCookie, ``, 404, []string{`{"errors":[{"message":"Season not found","appCode":"not_found_error","meta":{"name":"Season"}}]}`}},
		{"Delete season should succeed", "DELETE", "/api/seasons/2", cookie, ``, 204, []string{``}},
		{"Delete finished season should fail", "DELETE", "/api/seasons/1", cookie, ``, 400, []string{`{"errors":[{"message":"Cannot delete season when a season is finished","appCode":"season_finish_error","meta":null}]}`}},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {

			req := httptest.NewRequest(c.method, c.url, strings.NewReader(c.body))
			req.Header.Set("Cookie", c.cookie)
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf("expecting code: %d, got code: %d, with body: %s", c.expCode, res.Code, res.Body)
			}

			for _, body := range c.expBody {
				if !strings.Contains(res.Body.String(), body) {
					t.Fatalf("expecting: %s to contain: %s", res.Body, c.body)
				}
			}
		})

	}

}
