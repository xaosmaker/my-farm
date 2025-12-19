package auth

import (
	"encoding/json"
	"fmt"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
	"log"
	"net/http"
	"os"
	"time"
)

func (q AuthQueries) LoginUser(w http.ResponseWriter, r *http.Request) {
	type userValidation struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min=1"`
	}
	fields := userValidation{}
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&fields)
	if err := utils.ValidateFields(fields); err != nil {
		fmt.Println("Error validating fields", err)
		er.FieldErrors(400, err)(w, r)
		return
	}

	user, err := q.DB.GetUserByEmail(r.Context(), fields.Email)

	if err != nil {
		er.GeneralError(401, []string{"Invalid Credentials"})(w, r)
		return
	}
	if !ComparePassword(user.Password, fields.Password) {
		er.GeneralError(401, []string{"Invalid Credentials"})(w, r)
		return
	}
	user.Password = "****"
	key := os.Getenv("JWT_KEY")
	if key == "" {
		log.Fatal("JWT_KEY env is not assigned")
	}
	jwt, err := MakeJwt(fmt.Sprintf("%d", user.ID), key, time.Hour)
	if err != nil {
		fmt.Println("Failed to generate jwt token: ", err)
		er.GeneralError(401, []string{"Failed To Generate JWT Token"})(w, r)
		return

	}
	cookie := http.Cookie{
		Name:     "access",
		Value:    jwt,
		Path:     "/",
		SameSite: http.SameSiteStrictMode,
		Secure:   true,
		HttpOnly: true,
	}
	http.SetCookie(w, &cookie)
	w.WriteHeader(200)

}
