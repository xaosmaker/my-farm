package auth

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/db"
	"github.com/xaosmaker/server/internal/httpx"
	"github.com/xaosmaker/server/internal/util"
)

const (
	expires       = time.Hour
	verifyExpires = time.Hour * 2
)

func (q AuthQueries) LoginUser(w http.ResponseWriter, r *http.Request) {
	reqUser := struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min=1"`
	}{}
	if fieldError := httpx.DecodeAndValidate(r, &reqUser); fieldError != nil {
		fieldError(w, r)
		return

	}

	user, err := q.DB.GetUserByEmail(r.Context(), reqUser.Email)
	if err != nil {
		httpx.ServerError(401, nil)(w, r)
		return
	}
	if !ComparePassword(user.Password, reqUser.Password) {
		httpx.ServerError(401, nil)(w, r)
		return
	}

	user.Password = "****"
	key := os.Getenv("JWT_KEY")
	jwt, err := MakeJwt(fmt.Sprintf("%d", user.ID), key, expires)
	if err != nil {
		fmt.Println("Failed to generate jwt token: ", err)
		httpx.ServerError(401, nil)(w, r)
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

	userEnc, err := json.Marshal(s)
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
		return
	}
	w.WriteHeader(200)
	w.Write(userEnc)

}

func (q AuthQueries) ResendVefifyEmail(w http.ResponseWriter, r *http.Request) {

	reqVer := struct {
		Email string `json:"email" validate:"required"`
	}{}

	if fieldErr := httpx.DecodeAndValidate(r, &reqVer); fieldErr != nil {
		fieldErr(w, r)
		return
	}

	user, err := q.DB.GetUserByEmailNotActive(r.Context(), reqVer.Email)
	if err != nil {
		httpx.ServerError(400, httpx.NewErrMessage("Email already verified", apperror.EMAIL_VERIFIED, nil))(w, r)
		return
	}

	hostAddr := os.Getenv("NEXTAUTH_URL")
	hostStmtpVerKEY := os.Getenv("EMAIL_VERIFY_KEY")

	jwt, err := MakeJwt(fmt.Sprintf("%v", user.ID), hostStmtpVerKEY, verifyExpires)
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
		return
	}
	m := util.MailMessage(user.Email, "Confirmation Email",
		fmt.Sprintf("Hello %v welcome to My farm to activate your account pls click on this link\n %v/verify/%v", user.Email, hostAddr, jwt),
	)

	d := util.MailDialer()
	if err := d.DialAndSend(m); err != nil {
		httpx.ServerError(400, httpx.NewErrMessage("Failed to send email", apperror.EMAIL_SEND_ERROR, nil))(w, r)
		return
	}
	w.WriteHeader(200)

}
func (q AuthQueries) VerifyUser(w http.ResponseWriter, r *http.Request) {
	//TODO: later check if the user exists and if the users exists more option
	reqToken := struct {
		Token string `json:"token" validate:"required"`
	}{}

	if fieldError := httpx.DecodeAndValidate(r, &reqToken); fieldError != nil {
		fieldError(w, r)
		return
	}

	key := os.Getenv("EMAIL_VERIFY_KEY")
	userId, err := ValidateJwt(reqToken.Token, key)
	if err != nil {
		httpx.ServerError(400, httpx.NewErrMessage("failed to verify the token", apperror.INVALID_VERIFICATION_TOKEN, nil))(w, r)
		return
	}
	userIdNumber, err := strconv.ParseInt(userId, 10, 64)
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
		return
	}
	err = q.DB.UpdateUser(r.Context(), db.UpdateUserParams{
		ID:       userIdNumber,
		IsActive: util.ToPtr(true),
	})

	if err != nil {
		httpx.NewDBError(err.Error())(w, r)
		return
	}
	w.WriteHeader(200)
}

func (q AuthQueries) CreateUser(w http.ResponseWriter, r *http.Request) {
	reqUser := struct {
		Email           string `json:"email" validate:"required,email"`
		Password        string `json:"password" validate:"required,strongPassword=8"`
		ConfirmPassword string `json:"confirmPassword" validate:"required,eqfield=Password"`
	}{}
	if fieldError := httpx.DecodeAndValidate(r, &reqUser); fieldError != nil {
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
			httpx.ServerError(400, httpx.NewErrMessage("invalid email alread exists",
				apperror.EMAIL_EXIST_ERROR, nil))(w, r)
			return
		}
		httpx.NewDBError(err.Error())(w, r)
		return
	}

	hostAddr := os.Getenv("NEXTAUTH_URL")
	hostStmtpVerKEY := os.Getenv("EMAIL_VERIFY_KEY")

	jwt, err := MakeJwt(fmt.Sprintf("%v", user.ID), hostStmtpVerKEY, verifyExpires)
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
		return
	}
	m := util.MailMessage(user.Email, "Confirmation Email",
		fmt.Sprintf("Hello %v welcome to My farm to activate your account pls click on this link\n %v/verify/%v", user.Email, hostAddr, jwt),
	)

	d := util.MailDialer()
	if err := d.DialAndSend(m); err != nil {
		fmt.Println(err)
		httpx.ServerError(500, nil)(w, r)
		return
	}

	w.WriteHeader(201)

}
