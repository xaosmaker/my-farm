package auth

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
	"github.com/xaosmaker/server/internal/util"
)

const (
	expires       = time.Hour
	verifyExpires = time.Hour * 2
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
		httpx.GeneralError(400, err)(w, r)
		return
	}

	user, err := q.DB.GetUserByEmail(r.Context(), fields.Email)

	if err != nil {
		httpx.GeneralError(401, "Invalid Credentials")(w, r)
		return
	}
	if !ComparePassword(user.Password, fields.Password) {
		httpx.GeneralError(401, "Invalid Credentials")(w, r)
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
	//TODO: need to check later
	w.WriteHeader(200)
	if err == nil {

		w.Write(jUser)

	}

}
func (q AuthQueries) ResendVefifyEmail(w http.ResponseWriter, r *http.Request) {

	rd := struct {
		Email string `json:"email" validate:"required"`
	}{}

	if httpErr := httpx.DecodeAndValidate(r, &rd); httpErr != nil {
		httpErr(w, r)
		return
	}
	user, err := q.DB.GetUserByEmailNotActive(r.Context(), rd.Email)
	if err != nil {
		w.WriteHeader(200)
		return
	}

	hostAddr := os.Getenv("NEXTAUTH_URL")
	hostStmtpVerKEY := os.Getenv("EMAIL_VERIFY_KEY")

	jwt, err := MakeJwt(fmt.Sprintf("%v", user.ID), hostStmtpVerKEY, verifyExpires)
	if err != nil {
		httpx.GeneralError(500, nil)(w, r)
		return
	}
	m := util.MailMessage(user.Email, "Confirmation Email",
		fmt.Sprintf("Hello %v welcome to My farm to activate your account pls click on this link\n %v/verify/%v", user.Email, hostAddr, jwt),
	)

	d := util.MailDialer()
	if err := d.DialAndSend(m); err != nil {
		fmt.Println(err)
		httpx.GeneralError(500, nil)(w, r)
		return
	}
	w.WriteHeader(200)

}
func (q AuthQueries) VerifyUser(w http.ResponseWriter, r *http.Request) {
	//TODO: later check if the user exists and if the users exists more option
	rd := struct {
		Token string `json:"token" validate:"required"`
	}{}

	if httpErr := httpx.DecodeAndValidate(r, &rd); httpErr != nil {
		httpErr(w, r)
		return
	}

	hostStmtpVerKEY := os.Getenv("EMAIL_VERIFY_KEY")
	userId, err := ValidateJwt(rd.Token, hostStmtpVerKEY)
	if err != nil {
		httpx.GeneralError(400, "Validation failed")(w, r)
		return
	}
	userIdNumber, err := strconv.ParseInt(userId, 10, 64)
	if err != nil {
		httpx.GeneralError(500, nil)(w, r)
		return
	}
	err = q.DB.UpdateUser(r.Context(), db.UpdateUserParams{
		ID:       userIdNumber,
		IsActive: util.ToPtr(true),
	})

	if err != nil {
		httpx.GeneralError(400, err.Error())(w, r)
		return
	}
	w.WriteHeader(200)
}

func (q AuthQueries) CreateUser(w http.ResponseWriter, r *http.Request) {
	type UserRequest struct {
		Email           string `json:"email" validate:"required,email"`
		Password        string `json:"password" validate:"required,strongPassword=8"`
		ConfirmPassword string `json:"confirmPassword" validate:"required,eqfield=Password"`
	}
	reqUser := UserRequest{}
	fieldError := httpx.DecodeAndValidate(r, &reqUser)
	if fieldError != nil {
		fieldError(w, r)
		return
	}

	password, _ := HashPassword(reqUser.Password)
	user, err := q.DB.CreateUser(r.Context(), db.CreateUserParams{
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
	//TODO: finish emailVerification

	hostAddr := os.Getenv("NEXTAUTH_URL")
	hostStmtpVerKEY := os.Getenv("EMAIL_VERIFY_KEY")

	jwt, err := MakeJwt(fmt.Sprintf("%v", user.ID), hostStmtpVerKEY, verifyExpires)
	if err != nil {
		httpx.GeneralError(500, nil)(w, r)
		return
	}
	m := util.MailMessage(user.Email, "Confirmation Email",
		fmt.Sprintf("Hello %v welcome to My farm to activate your account pls click on this link\n %v/verify/%v", user.Email, hostAddr, jwt),
	)

	d := util.MailDialer()
	if err := d.DialAndSend(m); err != nil {
		fmt.Println(err)
		httpx.GeneralError(500, nil)(w, r)
		return
	}

	w.WriteHeader(201)

}
