package auth

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/xaosmaker/server/internal/httpx"
)

func (q AuthQueries) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/login") || strings.HasSuffix(r.URL.Path, "/create") || strings.HasSuffix(r.URL.Path, "/verify") || strings.HasSuffix(r.URL.Path, "/resendverify") {
			next.ServeHTTP(w, r)
			return
		}

		val, err := GetCookie(r, "access")
		if err != nil {
			fmt.Println("auth Error 1", err)
			httpx.GeneralError(401, "Login to continue")(w, r)
			return
		}
		jwtKey := os.Getenv("JWT_KEY")
		strId, err := ValidateJwt(val, jwtKey)

		if err != nil {
			fmt.Println("auth Error 2", err)
			httpx.GeneralError(401, "Login to continue")(w, r)
			return
		}
		id, err := strconv.ParseInt(strId, 10, 64)

		if err != nil {
			fmt.Println("auth Error 3", err)
			httpx.GeneralError(401, "Login to continue")(w, r)
			return
		}
		user, err := q.DB.GetUserByIdWithSettings(r.Context(), id)
		if err != nil {
			fmt.Println("auth Error 4", err)
			httpx.GeneralError(401, "Login to continue")(w, r)
			return
		}
		ctx := context.WithValue(r.Context(), "user", user)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})

}
