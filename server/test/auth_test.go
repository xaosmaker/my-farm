package test

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestLogin(t *testing.T) {
	cases := []struct {
		name    string
		body    string
		expCode int
		expBody []string
	}{
		{"login without body should fail", ``, 400, []string{`{"errors":[{"message":"email: Email is Required!","appCode":"required_field","meta":{"name":"email"}},{"message":"password: Password is Required!","appCode":"required_field","meta":{"name":"password"}}]}`}},
		{"login without password should fail", `{"email":"test@test.com"}`, 400, []string{`{"errors":[{"message":"password: Password is Required!","appCode":"required_field","meta":{"name":"password"}}]}`}},
		{"login with wrong email should fail", `{"email":"test123@test.com","password":"wrongPass"}`, 401, []string{`{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`}},
		{"login with incomplete email email should fail", `{"email":"test123@.com","password":"wrongPass"}`, 400, []string{`{"errors":[{"message":"email: Please provide a valid email","appCode":"invalid_email","meta":null}]}`}},
		{"login with wrong password should fail", `{"email":"test@test.com","password":"wrongPass"}`, 401, []string{`{"errors":[{"message":"Unauthorized","appCode":"unauthorized_error","meta":null}]}`}},
		{"login should succeed", `{"email":"test@test.com","password":"test"}`, 200, []string{`{"id":1,"email":"test@test.com","farmId":1,"farmName":"Δροσος Χωραφια"}`}},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/api/users/login", strings.NewReader(c.body))
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf("expecting Code: %d, got Code: %d", c.expCode, res.Code)
			}

			resBody := res.Body.String()
			for _, inBody := range c.expBody {
				if !strings.Contains(resBody, inBody) {
					t.Fatalf("expecting %s contain %s", resBody, inBody)

				}
			}
		})
	}
}

func TestRegister(t *testing.T) {
	cases := []struct {
		name    string
		body    string
		expCode int
		expBody []string
	}{
		{"Register without body should fail", ``, 400, []string{`{"errors":[{"message":"email: Email is Required!","appCode":"required_field","meta":{"name":"email"}},{"message":"password: Password is Required!","appCode":"required_field","meta":{"name":"password"}},{"message":"confirmPassword: ConfirmPassword is Required!","appCode":"required_field","meta":{"name":"confirmPassword"}}]}`}},
		{"Register with only email body should fail", `{"email":"test@test.com"}`, 400, []string{`{"errors":[{"message":"password: Password is Required!","appCode":"required_field","meta":{"name":"password"}},{"message":"confirmPassword: ConfirmPassword is Required!","appCode":"required_field","meta":{"name":"confirmPassword"}}]}`}},
		{"Register with email,password body should fail", `{"email":"test@test.com","password":"Test1Ites"}`, 400, []string{`{"errors":[{"message":"confirmPassword: ConfirmPassword is Required!","appCode":"required_field","meta":{"name":"confirmPassword"}}]}`}},
		{"Register with invalid password should fail", `{"email":"test@test.com","password":"test","confirmPassword":"test2"}`, 400, []string{`{"errors":[{"message":"password: Password should contains Capital letters, digits and has length greater than 8","appCode":"invalid_password_length","meta":{"min":"8"}}`}},
		{"Register with invalid email should fail", `{"email":"test@.com","password":"Test1srs","confirmPassword":"Test1srs"}`, 400, []string{`{"errors":[{"message":"email: Please provide a valid email","appCode":"invalid_email","meta":null}]}`}},
		{"Register with confirm password mismatch should fail", `{"email":"test@test.com","password":"Test1srs","confirmPassword":"test2"}`, 400, []string{`{"errors":[{"message":"confirmPassword: ConfirmPassword mismatch Password","appCode":"invalid_password_mismatch","meta":{"fieldA":"ConfirmPassword","fieldB":"Password"}}]}`}},
		{"Register with exist email should fail", `{"email":"test@test.com","password":"Test1srs","confirmPassword":"Test1srs"}`, 400, []string{`{"errors":[{"message":"invalid email alread exists","appCode":"invalid_email_exist","meta":null}]}`}},
		{"Register should succeed", `{"email":"test1@test.com","password":"Test1srs","confirmPassword":"Test1srs"}`, 201, []string{``}},
	}

	for _, c := range cases {
		t.Cleanup(func() {

			q, err := conn.Query(ctx, `delete from users where email = $1;`, "test1@test.com")
			q.Close()
			if err != nil {
				t.Fatal(err)
			}
		})
		t.Run(c.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/api/users/create", strings.NewReader(c.body))
			res := httptest.NewRecorder()
			testServer.ServeHTTP(res, req)

			if res.Code != c.expCode {
				t.Fatalf("expecting Code: %d, got Code: %d", c.expCode, res.Code)
			}

			resBody := res.Body.String()
			for _, inBody := range c.expBody {
				if !strings.Contains(resBody, inBody) {
					t.Fatalf("expecting %s contain %s", resBody, inBody)

				}

			}

			// i test the verification fo the email here so i dont need to recreate and catch the email eagian
			if res.Code == 201 {

				maipitReq, err := http.NewRequest("GET", "http://farm-mailpit:8025/api/v1/messages", nil)
				if err != nil {
					t.Fatal(err.Error(), "error")
				}
				maipitReq.Header.Set("Accept", "application/json")
				resClient := &http.Client{}
				mailpitRes, err := resClient.Do(maipitReq)
				if err != nil {
					t.Fatal(err.Error(), "error")
				}
				defer mailpitRes.Body.Close()
				b, _ := io.ReadAll(mailpitRes.Body)
				mailBody := "Hello test1@test.com welcome to My farm to activate your account pls click on this link http://localhost:8080/verify/"
				if !strings.Contains(string(b), mailBody) {
					t.Fatalf("email body: %s not contail: %s", b, mailBody)

				}
				// here i do the test for verify user i have the key already
				var messageID string
				for str := range strings.SplitSeq(string(b), ",") {
					if strings.HasPrefix(str, "\"messages\":[{\"ID\":") {
						messageID = strings.Trim(strings.Split(str, ":")[2], "\"")
					}
				}

				maipitReq, err = http.NewRequest("GET", fmt.Sprintf("http://farm-mailpit:8025/api/v1/message/%v", messageID), nil)
				if err != nil {
					t.Fatal(err.Error(), "error")
				}
				maipitReq.Header.Set("Accept", "application/json")
				resClient = &http.Client{}
				mailpitRes, err = resClient.Do(maipitReq)
				if err != nil {
					t.Fatal(err.Error(), "error")
				}

				b, _ = io.ReadAll(mailpitRes.Body)
				str := strings.Split(string(b), "/")
				token := strings.Split(str[len(str)-1], "\"")[0]

				valReq := httptest.NewRequest("POST", "/api/users/verify", strings.NewReader(fmt.Sprintf(`{"token":"%s"}`, token)))
				valRes := httptest.NewRecorder()
				testServer.ServeHTTP(valRes, valReq)
				if valRes.Code != 200 {
					t.Error(token)
					t.Error("The email doent vefity")
					t.Fatalf("expected code: %d got Code: %d, with body: %v", 200, valRes.Code, valRes.Body)

				}

			}
		})
	}

}
