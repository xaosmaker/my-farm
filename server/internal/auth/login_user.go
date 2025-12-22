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
	if err := utils.ValidateFields(fields); err != nil {
		fmt.Println("Error validating fields", err)
		er.GeneralError(400, err)(w, r)
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
	jwt, err := MakeJwt(fmt.Sprintf("%d", user.ID), key, expires)
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
		Expires:  time.Now().Add(expires),
	}
	http.SetCookie(w, &cookie)

	type SendUser struct {
		IsSuperuser bool    `json:"isSuperuser"`
		ID          int64   `json:"id"`
		Email       string  `json:"email"`
		IsStaff     bool    `json:"isStaff"`
		FarmID      *int64  `json:"farmId"`
		FarmName    *string `json:"farmName"`
	}

	s := SendUser{
		ID:          user.ID,
		Email:       user.Email,
		IsStaff:     user.IsStaff,
		IsSuperuser: user.IsSuperuser,
	}
	farm, err := q.DB.GetFarm(r.Context(), user.ID)
	if err == nil {
		s.FarmID = &farm.ID
		s.FarmName = &farm.FarmName

	}

	jUser, err := json.Marshal(s)

	w.WriteHeader(200)
	if err == nil {

		w.Write(jUser)

	}

}
