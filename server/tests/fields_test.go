package tests

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

func TestFieldsGetField(t *testing.T) {
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
			err := setLandUnit("m2")
			if err != nil {
				t.Log(err.Error())
			}

		})

		t.Run(c.name, func(t *testing.T) {
			if c.landUnit != nil {
				err := setLandUnit(*c.landUnit)
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
func TestDeleteField(t *testing.T) {
	//need to implement this
	// cases := struct {
	// 	name    string
	// 	fieldId string
	// 	expCode int
	// 	expBody string
	// }{}
	t.SkipNow()
}

func TestGetFieldsErrors(t *testing.T) {

	cases := []struct {
		name    string
		fieldId string
		expCode int
		expBody string
	}{
		{"get field wrond id", "250", 404, `{"status":404,"errors":[{"message":"No Field found"}]}`},
		{"get field string id", "ssf", 400, `{"status":400,"errors":[{"message":"Cant Convert path value to int: id"}]}`},
		{"get field string number id", "s1", 400, `{"status":400,"errors":[{"message":"Cant Convert path value to int: id"}]}`},
	}

	for _, c := range cases {

		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", fmt.Sprintf("/api/fields/%v", c.fieldId), nil)
			req.Header.Set("Cookie", cookie)
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

func TestFieldsCreateField(t *testing.T) {

	cases := []struct {
		name     string
		landUnit *string
		reqBody  string
		expCode  int
		expBody  []string
	}{
		// test with m2
		{"create field with empty body", nil, `{}`, 400, []string{`{"status":400,"errors":[{"message":"name: Name is Required!"},{"message":"fieldLocation: FieldLocation should contain only chars spaces and number"},{"message":"areaInMeters: AreaInMeters is Required!"}]}`}},
		{"create field with name", nil, `{"name":"randomName"}`, 400, []string{`{"status":400,"errors":[{"message":"fieldLocation: FieldLocation should contain only chars spaces and number"},{"message":"areaInMeters: AreaInMeters is Required!"}]}`}},
		{"create field with name, fieldLocation", nil, `{"name":"randomName","fieldLocation":"randomName"}`, 400, []string{`{"status":400,"errors":[{"message":"areaInMeters: AreaInMeters is Required!"}]}`}},
		{"create field with existing name", nil, `{"name":"γουρουνια","fieldLocation":"randomName","areaInMeters":35000}`, 400, []string{`{"status":400,"errors":[{"message":"Field already exists with this name"}]}`}},
		{"create field.", nil, `{"name":"randomName","fieldLocation":"randomName","areaInMeters":35000}`, 201, []string{`"id":`, `"name":"randomName"`, `"epsg2100Boundary":null`, `"epsg4326Boundary":null`, `"mapLocation":null`, `"fieldLocation":"randomName"`, `"areaInMeters":35000`, `"isOwned":false`, `"createdAt":"`, `"updatedAt":"`, `"landUnit":"m2"`}},
		// test with stremata
		{"create field. stremata", toPtr("stremata"), `{"name":"randomName","fieldLocation":"randomName","areaInMeters":25}`, 201, []string{`"id":`, `"name":"randomName"`, `"epsg2100Boundary":null`, `"epsg4326Boundary":null`, `"mapLocation":null`, `"fieldLocation":"randomName"`, `"areaInMeters":25`, `"isOwned":false`, `"createdAt":"`, `"updatedAt":"`, `"landUnit":"stremata"`}},
		//test with hectares
		{"create field. hectares", toPtr("hectares"), `{"name":"randomName","fieldLocation":"randomName","areaInMeters":25}`, 201, []string{`"id":`, `"name":"randomName"`, `"epsg2100Boundary":null`, `"epsg4326Boundary":null`, `"mapLocation":null`, `"fieldLocation":"randomName"`, `"areaInMeters":25`, `"isOwned":false`, `"createdAt":"`, `"updatedAt":"`, `"landUnit":"hectares"`}},
	}

	for _, c := range cases {

		t.Cleanup(func() {
			err := setLandUnit("m2")
			if err != nil {
				t.Log(err.Error())
			}

		})

		t.Run(c.name, func(t *testing.T) {

			if c.landUnit != nil {
				err := setLandUnit(*c.landUnit)
				if err != nil {
					t.Log(err.Error())
				}

			}

			req := httptest.NewRequest("POST", "/api/fields", strings.NewReader(c.reqBody))
			req.Header.Set("Cookie", cookie)
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
					req := httptest.NewRequest("DELETE", fmt.Sprintf("/api/fields/%s", id), nil)
					req.Header.Set("Cookie", cookie)
					res := httptest.NewRecorder()
					testServer.ServeHTTP(res, req)
					if res.Code != 204 {
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
