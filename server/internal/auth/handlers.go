package auth

import (
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

func (q AuthQueries) LoginUser(w http.ResponseWriter, r *http.Request) error {
	reqUser := struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min=1"`
	}{}
	if err := httpx.DecodeAndVal(r, &reqUser); err != nil {
		return err

	}

	user, err := q.DB.GetUserByEmail(r.Context(), reqUser.Email)
	if err != nil {
		httpx.ServerError(401, nil)(w, r)
		return apperror.New401UnauthorizedError("", err)
	}

	if !ComparePassword(user.Password, reqUser.Password) {
		return apperror.New401UnauthorizedError("", fmt.Errorf("Passowrd dont match"))
	}

	user.Password = "****"
	key := os.Getenv("JWT_KEY")
	jwt, err := MakeJwt(fmt.Sprintf("%d", user.ID), key, expires)
	if err != nil {
		return apperror.New401UnauthorizedError("", err)
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

	return httpx.WriteJSON(w, 200, s)

}

func (q AuthQueries) ResendVefifyEmail(w http.ResponseWriter, r *http.Request) error {

	reqVer := struct {
		Email string `json:"email" validate:"required"`
	}{}

	if err := httpx.DecodeAndVal(r, &reqVer); err != nil {
		return err
	}

	user, err := q.DB.GetUserByEmailNotActive(r.Context(), reqVer.Email)
	if err != nil {
		return apperror.New400Error([]apperror.ErrorMessage{
			{
				Message: "Email already verified",
				AppCode: apperror.EMAIL_VERIFIED,
				Meta:    nil,
			},
		}, nil)
	}

	hostAddr := os.Getenv("NEXTAUTH_URL")
	hostStmtpVerKEY := os.Getenv("EMAIL_VERIFY_KEY")

	jwt, err := MakeJwt(fmt.Sprintf("%v", user.ID), hostStmtpVerKEY, verifyExpires)
	if err != nil {
		return apperror.New500Error(err)
	}

	m := util.MailMessage(user.Email, "Confirmation Email",
		fmt.Sprintf("Hello %v welcome to My farm to activate your account pls click on this link\n %v/verify/%v", user.Email, hostAddr, jwt),
	)

	d := util.MailDialer()
	if err := d.DialAndSend(m); err != nil {
		return apperror.New400Error([]apperror.ErrorMessage{{
			Message: "Failed to send email",
			AppCode: apperror.EMAIL_SEND_ERROR,
			Meta:    nil}}, nil)
	}

	return httpx.WriteJSON(w, 200, nil)

}

func (q AuthQueries) VerifyUser(w http.ResponseWriter, r *http.Request) error {
	//TODO: later check if the user exists and if the users exists more option
	reqToken := struct {
		Token string `json:"token" validate:"required"`
	}{}

	if err := httpx.DecodeAndVal(r, &reqToken); err != nil {
		return err
	}

	key := os.Getenv("EMAIL_VERIFY_KEY")
	userId, err := ValidateJwt(reqToken.Token, key)
	if err != nil {
		return apperror.New400Error([]apperror.ErrorMessage{{
			Message: "failed to verify the token",
			AppCode: apperror.INVALID_VERIFICATION_TOKEN,
			Meta:    nil}}, nil)
	}

	userIdNumber, err := strconv.ParseInt(userId, 10, 64)
	if err != nil {
		httpx.ServerError(500, nil)(w, r)
		return apperror.New500Error(err)
	}

	err = q.DB.UpdateUser(r.Context(), db.UpdateUserParams{
		ID:       userIdNumber,
		IsActive: util.ToPtr(true),
	})

	if err != nil {
		return apperror.New503DBError("DB error", err)
	}
	return httpx.WriteJSON(w, 200, nil)
}

func (q AuthQueries) CreateUser(w http.ResponseWriter, r *http.Request) error {

	reqUser := struct {
		Email           string `json:"email" validate:"required,email"`
		Password        string `json:"password" validate:"required,strongPassword=8"`
		ConfirmPassword string `json:"confirmPassword" validate:"required,eqfield=Password"`
	}{}
	if err := httpx.DecodeAndVal(r, &reqUser); err != nil {
		return err
	}

	password, _ := HashPassword(reqUser.Password)
	user, err := q.DB.CreateUser(r.Context(), db.CreateUserParams{
		Email:    reqUser.Email,
		Password: password,
	})
	if err != nil {
		if strings.Contains(err.Error(), "23505") {
			return apperror.New400Error([]apperror.ErrorMessage{{
				Message: "invalid email alread exists",
				AppCode: apperror.EMAIL_EXIST_ERROR,
				Meta:    nil}}, nil)
		}
		return apperror.New503DBError("DB error", err)
	}

	hostAddr := os.Getenv("NEXTAUTH_URL")
	hostStmtpVerKEY := os.Getenv("EMAIL_VERIFY_KEY")

	jwt, err := MakeJwt(fmt.Sprintf("%v", user.ID), hostStmtpVerKEY, verifyExpires)
	if err != nil {
		return apperror.New500Error(err)
	}

	m := util.MailMessage(user.Email, "Confirmation Email",
		fmt.Sprintf("Hello %v welcome to My farm to activate your account pls click on this link\n %v/verify/%v", user.Email, hostAddr, jwt),
	)

	d := util.MailDialer()
	if err := d.DialAndSend(m); err != nil {
		return apperror.New500Error(err)
	}

	return httpx.WriteJSON(w, 201, nil)

}
