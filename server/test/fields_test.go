package test

import (
	"encoding/json"
	"fmt"
	"net/http/httptest"
	"reflect"
	"strings"
	"testing"
	"time"
)

type fieldResponse struct {
	ID               int64            `json:"id"`
	Name             string           `json:"name"`
	Epsg2100Boundary *json.RawMessage `json:"epsg2100Boundary"`
	Epsg4326Boundary *json.RawMessage `json:"epsg4326Boundary"`
	MapLocation      *json.RawMessage `json:"mapLocation"`
	FieldLocation    *string          `json:"fieldLocation"`
	AreaInMeters     float64          `json:"areaInMeters"`
	IsOwned          bool             `json:"isOwned"`
	CreatedAt        *time.Time       `json:"createdAt"`
	UpdatedAt        *time.Time       `json:"updatedAt"`
	LandUnit         any              `json:"landUnit"`
}

func TestCreateField(t *testing.T) {
	nofieldsCookie := loginUserCookie("nofieldsuser@test.com", "test")

	cases := []struct {
		name     string
		cookie   string
		landUnit *string
		reqBody  string
		expCode  int
		expBody  []string
	}{
		// test with m2
		{"create field with empty body", cookie, nil, `{}`, 400, []string{`{"status":400,"errors":[{"message":"name: Name is Required!"},{"message":"fieldLocation: FieldLocation should contain only chars spaces and number"},{"message":"areaInMeters: AreaInMeters is Required!"}]}`}},
		{"create field with name", cookie, nil, `{"name":"randomName"}`, 400, []string{`{"status":400,"errors":[{"message":"fieldLocation: FieldLocation should contain only chars spaces and number"},{"message":"areaInMeters: AreaInMeters is Required!"}]}`}},
		{"create field with name, fieldLocation", cookie, nil, `{"name":"randomName","fieldLocation":"randomName"}`, 400, []string{`{"status":400,"errors":[{"message":"areaInMeters: AreaInMeters is Required!"}]}`}},
		{"create field with existing name", cookie, nil, `{"name":"γουρουνια","fieldLocation":"randomName","areaInMeters":35000}`, 400, []string{`{"status":400,"errors":[{"message":"Field already exists with this name"}]}`}},
		{"create field.", cookie, nil, `{"name":"randomName","fieldLocation":"randomName","areaInMeters":35000}`, 201, []string{`"id":`, `"name":"randomName"`, `"epsg2100Boundary":null`, `"epsg4326Boundary":null`, `"mapLocation":null`, `"fieldLocation":"randomName"`, `"areaInMeters":35000`, `"isOwned":false`, `"createdAt":"`, `"updatedAt":"`, `"landUnit":"m2"`}},
		// test with stremata
		{"create field. stremata", cookie, toPtr("stremata"), `{"name":"randomName","fieldLocation":"randomName","areaInMeters":25}`, 201, []string{`"id":`, `"name":"randomName"`, `"epsg2100Boundary":null`, `"epsg4326Boundary":null`, `"mapLocation":null`, `"fieldLocation":"randomName"`, `"areaInMeters":25`, `"isOwned":false`, `"createdAt":"`, `"updatedAt":"`, `"landUnit":"stremata"`}},
		//test with hectares
		{"create field. hectares", cookie, toPtr("hectares"), `{"name":"randomName","fieldLocation":"randomName","areaInMeters":25}`, 201, []string{`"id":`, `"name":"randomName"`, `"epsg2100Boundary":null`, `"epsg4326Boundary":null`, `"mapLocation":null`, `"fieldLocation":"randomName"`, `"areaInMeters":25`, `"isOwned":false`, `"createdAt":"`, `"updatedAt":"`, `"landUnit":"hectares"`}},
		{"create field. another user with the same field name", nofieldsCookie, toPtr("hectares"), `{"name":"γουρουνια","fieldLocation":"randomName","areaInMeters":25}`, 201, []string{`"id":`, `"name":"γουρουνια"`, `"epsg2100Boundary":null`, `"epsg4326Boundary":null`, `"mapLocation":null`, `"fieldLocation":"randomName"`, `"areaInMeters":25`, `"isOwned":false`, `"createdAt":"`, `"updatedAt":"`, `"landUnit":"hectares"`}},
	}

	for _, c := range cases {

		t.Cleanup(func() {
			err := setLandUnit("m2", c.cookie)
			if err != nil {
				t.Log(err.Error())
			}

		})

		t.Run(c.name, func(t *testing.T) {

			if c.landUnit != nil {
				err := setLandUnit(*c.landUnit, c.cookie)
				if err != nil {
					t.Log("change landunitError", err.Error())
				}

			}

			req := httptest.NewRequest("POST", "/api/fields", strings.NewReader(c.reqBody))
			req.Header.Set("Cookie", c.cookie)
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)
			resBody := res.Body.String()

			t.Cleanup(func() {
				if strings.HasPrefix(c.name, "create field.") {
					var id string
					for val := range strings.SplitSeq(resBody, ",") {
						if strings.Contains(val, "id") {
							id = strings.Split(val, ":")[1]
							break
						}
					}
					ok := deleteField(id, c.cookie)
					if !ok {
						t.Fatalf("cannot delete create field with id: %s, body: %v", id, res.Body)
					}
				}
			})

			if res.Code != c.expCode {
				t.Fatalf("expected code: %d, got: %d, with body: %s", c.expCode, res.Code, res.Body.String())
			}
			for _, str := range c.expBody {
				if !strings.Contains(resBody, str) {
					t.Fatalf("body: %s dont contain: %s", resBody, str)

				}
			}

		})
	}
}

func TestDeleteField(t *testing.T) {
	createdField := createField(cookie)
	nofieldsCookie := loginUserCookie("nofieldsuser@test.com", "test")

	t.Cleanup(func() {
		deleteField(createdField.ID, cookie)
	})

	cases := []struct {
		name    string
		fieldId string
		expCode int
		cookie  string
		expBody string
	}{
		{"delete field", fmt.Sprintf("%v", createdField.ID), 204, cookie, ""},
		{"delete field not existing field", "170", 404, cookie, `{"status":404,"errors":[{"message":"Field not found"}]}`},
		{"delete field wiht string id", "sss", 400, cookie, `{"status":400,"errors":[{"message":"Cant Convert path value to int: id"}]}`},
		{"delete field wiht string int id", "sss190", 400, cookie, `{"status":400,"errors":[{"message":"Cant Convert path value to int: id"}]}`},
		{"delete field from another user ", "2", 404, nofieldsCookie, `{"status":404,"errors":[{"message":"Field not found"}]}`},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {

			req := httptest.NewRequest("DELETE", fmt.Sprintf("/api/fields/%s", c.fieldId), nil)
			req.Header.Set("Cookie", c.cookie)
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf("expected code: %d, got: %d, with body: %s", c.expCode, res.Code, res.Body.String())
			}

			if res.Body.String() != c.expBody {
				t.Fatalf("expected: %v got: %v", c.expBody, res.Body)

			}
		})
	}
}

func TestGetField(t *testing.T) {
	cases := []struct {
		name     string
		landUnit *string
		fieldId  int
		expCode  int
		expBody  fieldResponse
	}{
		{"get field", nil, 1, 200, fieldResponse{ID: 1, Name: "γουρουνια", Epsg2100Boundary: nil, Epsg4326Boundary: nil, MapLocation: nil,
			FieldLocation: toPtr("γουρουνια"), AreaInMeters: 35000, IsOwned: false,
			CreatedAt: toPtr(time.Date(2026, 10, 11, 0, 0, 0, 0, time.UTC)),
			UpdatedAt: toPtr(time.Date(2026, 10, 11, 0, 0, 0, 0, time.UTC)),
			LandUnit:  "m2"}},

		{"get field stremata", toPtr("stremata"), 1, 200, fieldResponse{ID: 1, Name: "γουρουνια", Epsg2100Boundary: nil, Epsg4326Boundary: nil, MapLocation: nil,
			FieldLocation: toPtr("γουρουνια"), AreaInMeters: 35, IsOwned: false,
			CreatedAt: toPtr(time.Date(2026, 10, 11, 0, 0, 0, 0, time.UTC)),
			UpdatedAt: toPtr(time.Date(2026, 10, 11, 0, 0, 0, 0, time.UTC)),
			LandUnit:  "stremata"}},

		{"get field hectares", toPtr("hectares"), 1, 200, fieldResponse{ID: 1, Name: "γουρουνια", Epsg2100Boundary: nil, Epsg4326Boundary: nil, MapLocation: nil,
			FieldLocation: toPtr("γουρουνια"), AreaInMeters: 3.5, IsOwned: false,
			CreatedAt: toPtr(time.Date(2026, 10, 11, 0, 0, 0, 0, time.UTC)),
			UpdatedAt: toPtr(time.Date(2026, 10, 11, 0, 0, 0, 0, time.UTC)),
			LandUnit:  "hectares"}},
	}
	for _, c := range cases {

		t.Cleanup(func() {
			err := setLandUnit("m2", cookie)
			if err != nil {
				t.Log(err.Error())
			}

		})

		t.Run(c.name, func(t *testing.T) {
			if c.landUnit != nil {
				err := setLandUnit(*c.landUnit, cookie)
				if err != nil {
					t.Log(err.Error())
				}

			}
			rb := fieldResponse{}

			req := httptest.NewRequest("GET", fmt.Sprintf("/api/fields/%v", c.fieldId), nil)
			req.Header.Set("Cookie", cookie)
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)
			decoder := json.NewDecoder(res.Body)
			err := decoder.Decode(&rb)
			if err != nil {
				t.Fatalf("fail to decode %v", err.Error())
			}

			if res.Code != c.expCode {
				t.Fatalf("expected code: %d, got: %d, with body: %s", c.expCode, res.Code, res.Body.String())

			}
			if !reflect.DeepEqual(c.expBody, rb) {
				t.Fatalf("expected: %v got: %v", c.expBody, rb)
			}
		})
	}
}

func TestGetFieldError(t *testing.T) {

	nofieldsCookie := loginUserCookie("nofieldsuser@test.com", "test")
	cases := []struct {
		name    string
		cookie  string
		fieldId string
		expCode int
		expBody string
	}{
		{"get field wrond id", cookie, "250", 404, `{"status":404,"errors":[{"message":"Field not found"}]}`},
		{"get field string id", cookie, "ssf", 400, `{"status":400,"errors":[{"message":"Cant Convert path value to int: id"}]}`},
		{"get field string number id", cookie, "s1", 400, `{"status":400,"errors":[{"message":"Cant Convert path value to int: id"}]}`},
		{"get field from another user", nofieldsCookie, "2", 404, `{"status":404,"errors":[{"message":"Field not found"}]}`},
	}

	for _, c := range cases {

		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", fmt.Sprintf("/api/fields/%v", c.fieldId), nil)
			req.Header.Set("Cookie", c.cookie)
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf("expected code: %d, got: %d, with body: %s", c.expCode, res.Code, res.Body.String())
			}
			if res.Body.String() != c.expBody {
				t.Fatalf("expected: %v got: %v", c.expBody, res.Body)

			}

		})
	}

}

func TestGetAllFields(t *testing.T) {

	nofieldsCookie := loginUserCookie("nofieldsuser@test.com", "test")
	cases := []struct {
		name         string
		cookie       string
		expCode      int
		expBodyCount int
		checkData    bool
	}{
		{"get all fields", cookie, 200, 25, true},
		{"get all fields not fields", nofieldsCookie, 200, 0, false},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", "/api/fields", nil)
			req.Header.Set("Cookie", c.cookie)
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)
			rd := []fieldResponse{}

			decoder := json.NewDecoder(res.Body)
			if err := decoder.Decode(&rd); err != nil {
				t.Log("Cant decode res.Body")
			}
			if len(rd) != c.expBodyCount {
				t.Fatalf("ecpected body count: %v, got: %v", c.expBodyCount, len(rd))
			}
			if c.checkData {
				first := rd[0]
				req := httptest.NewRequest("GET", fmt.Sprintf("/api/fields/%v", first.ID), nil)
				req.Header.Set("Cookie", c.cookie)
				res := httptest.NewRecorder()
				testServer.ServeHTTP(res, req)
				data := fieldResponse{}

				decoder := json.NewDecoder(res.Body)
				if err := decoder.Decode(&data); err != nil {
					t.Fatal("Cant decode res.Body")
				}
				if !reflect.DeepEqual(data, first) {
					t.Fatalf("%v is no equal to %v", data, first)

				}

			}
		})
	}

}

func TestUpdateFields(t *testing.T) {

	nofieldsCookie := loginUserCookie("nofieldsuser@test.com", "test")

	req := httptest.NewRequest("POST", "/api/fields", strings.NewReader(`{"name":"randomName","fieldLocation":"randomName","areaInMeters":35000}`))
	req.Header.Set("Cookie", nofieldsCookie)
	field := httptest.NewRecorder()
	testServer.ServeHTTP(field, req)

	var fieldId string
	for str := range strings.SplitSeq(field.Body.String(), ",") {
		if strings.Contains(str, "id") {
			fieldId = strings.Split(str, ":")[1]
		}

	}

	cases := []struct {
		name    string
		cookie  string
		fieldId string
		body    string
		expCode int
		expBody []string
	}{
		{"wrong path id should fail", cookie, "ss", ``, 400, []string{`{"status":400,"errors":[{"message":"Cant Convert path value to int: id"}]}`}},
		{"wrong path id should fail", cookie, "1205", ``, 400, []string{`{"status":400,"errors":[{"message":"Field not found"}]}`}},
		{"update not existing field", nofieldsCookie, "1", ``, 400, []string{`{"status":400,"errors":[{"message":"Field not found"}]}`}},
		{"update field should fail", nofieldsCookie, "1", ``, 400, []string{`{"status":400,"errors":[{"message":"Field not found"}]}`}},
		{"update field name should succeed", nofieldsCookie, fieldId, `{"name":"randomName2"}`, 200, []string{`"name":"randomName2"`, `"fieldLocation":"randomName"`, `"areaInMeters":35000`}},
		{"update field wrong name should fail", nofieldsCookie, fieldId, `{"name":"randomName2!2$"}`, 400, []string{`{"status":400,"errors":[{"message":"name: Name should contain only chars spaces and number"}]}`}},
		{"update field fieldLocation should succeed", nofieldsCookie, fieldId, `{"fieldLocation":"randomName2"}`, 200, []string{`"name":"randomName2"`, `"fieldLocation":"randomName2"`, `"areaInMeters":35000`}},
		{"update field areaInMeters should succeed", nofieldsCookie, fieldId, `{"areaInMeters":22}`, 200, []string{`"name":"randomName2"`, `"fieldLocation":"randomName2"`, `"areaInMeters":22`}},
		{"update field name with existing should fail", cookie, "2", `{"name":"γουρουνια"}`, 400, []string{`{"status":400,"errors":[{"message":"Field already exists with this name"}]}`}},
	}

	t.Cleanup(func() {
		req := httptest.NewRequest("DELETE", fmt.Sprintf("/api/fields/%s", fieldId), nil)
		req.Header.Set("Cookie", nofieldsCookie)

		res := httptest.NewRecorder()
		testServer.ServeHTTP(res, req)
	})
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest("PATCH", fmt.Sprintf("/api/fields/%v", c.fieldId), strings.NewReader(c.body))
			req.Header.Set("Cookie", c.cookie)
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {

				t.Fatalf("ecpected code: %v, got: %v with body: %v", c.expCode, res.Code, res.Body)
			}

			strBody := res.Body.String()
			for _, exp := range c.expBody {
				if !strings.Contains(strBody, exp) {

					t.Fatalf("%v dont contain: %v", strBody, exp)
				}

			}

		})
	}
}
