package auth

import (
	"net/http"
	"strings"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/er"
	"github.com/xaosmaker/server/internal/utils"
)

func (q AuthQueries) CreateUser(w http.ResponseWriter, r *http.Request) {
	type UserRequest struct {
		Email           string `json:"email" validate:"required,email"`
		Password        string `json:"password" validate:"required,strongPassword=12"`
		ConfirmPassword string `json:"confirmPassword" validate:"required,eqfield=Password"`
	}
	reqUser := UserRequest{}
	fieldError := utils.DecodeAndValidate(r, &reqUser)
	if fieldError != nil {
		er.GeneralError(400, fieldError)(w, r)
		return
	}

	password, _ := HashPassword(reqUser.Password)
	_, err := q.DB.CreateUser(r.Context(), db.CreateUserParams{
		Email:    reqUser.Email,
		Password: password,
	})
	if err != nil {
		if strings.Contains(err.Error(), "23505") {
			er.GeneralError(400, "user already exists")(w, r)
			return
		}
		er.GeneralError(400, err.Error())(w, r)
		return
	}
	w.WriteHeader(201)

}
