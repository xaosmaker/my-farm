package auth

import (
	"encoding/json"
	"fmt"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

const (
	expires = time.Hour
)

func (q AuthQueries) LoginUser(w http.ResponseWriter, r *http.Request) {
	type userValidation struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min=1"`
	}
	fields := userValidation{}
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&fields)
	if err := httpx.ValidateFields(fields); err != nil {
		fmt.Println("Error validating fields", err)
		httpx.GeneralError(400, err)(w, r)
		return
	}

	user, err := q.DB.GetUserByEmail(r.Context(), fields.Email)

	if err != nil {
		httpx.GeneralError(401, []string{"Invalid Credentials"})(w, r)
		return
	}
	if !ComparePassword(user.Password, fields.Password) {
		httpx.GeneralError(401, []string{"Invalid Credentials"})(w, r)
		return
	}
	user.Password = "****"
	key := os.Getenv("JWT_KEY")
	if key == "" {
		log.Fatal("JWT_KEY env is not assigned")
	}
	jwt, err := MakeJwt(fmt.Sprintf("%d", user.ID), key, expires)
	if err != nil {
		fmt.Println("Failed to generate jwt token: ", err)
		httpx.GeneralError(401, []string{"Failed To Generate JWT Token"})(w, r)
		return

	}
	cookie := http.Cookie{
		Name:     "access",
		Value:    jwt,
		Path:     "/",
		SameSite: http.SameSiteStrictMode,
		Secure:   true,
		HttpOnly: true,
		Expires:  time.Now().Add(expires),
	}
	http.SetCookie(w, &cookie)

	type SendUser struct {
		ID       int64   `json:"id"`
		Email    string  `json:"email"`
		FarmID   *int64  `json:"farmId"`
		FarmName *string `json:"farmName"`
	}
	s := SendUser{
		ID:    user.ID,
		Email: user.Email,
	}
	farm, err := q.DB.GetFarm(r.Context(), user.ID)
	if err == nil {
		s.FarmID = &farm.ID
		s.FarmName = &farm.Name
	}

	jUser, err := json.Marshal(s)

	w.WriteHeader(200)
	if err == nil {

		w.Write(jUser)

	}

}

func (q AuthQueries) CreateUser(w http.ResponseWriter, r *http.Request) {
	type UserRequest struct {
		Email           string `json:"email" validate:"required,email"`
		Password        string `json:"password" validate:"required,strongPassword=12"`
		ConfirmPassword string `json:"confirmPassword" validate:"required,eqfield=Password"`
	}
	reqUser := UserRequest{}
	fieldError := httpx.DecodeAndValidate(r, &reqUser)
	if fieldError != nil {
		httpx.GeneralError(400, fieldError)(w, r)
		return
	}

	password, _ := HashPassword(reqUser.Password)
	err := q.DB.CreateUser(r.Context(), db.CreateUserParams{
		Email:    reqUser.Email,
		Password: password,
	})
	if err != nil {
		if strings.Contains(err.Error(), "23505") {
			httpx.GeneralError(400, "user already exists")(w, r)
			return
		}
		httpx.GeneralError(400, err.Error())(w, r)
		return
	}
	w.WriteHeader(201)

}
