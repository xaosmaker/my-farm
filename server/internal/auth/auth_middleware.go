package auth

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/xaosmaker/server/internal/er"
)

func (q AuthQueries) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/login") || strings.HasSuffix(r.URL.Path, "/create") {
			next.ServeHTTP(w, r)
			return
		}

		val, err := GetCookie(r, "access")
		if err != nil {
			fmt.Println("auth Error", err)
			er.GeneralError(401, "Login to continue")(w, r)
			return
		}
		strId, err := ValidateJwt(val)

		if err != nil {
			fmt.Println("auth Error", err)
			er.GeneralError(401, "Login to continue")(w, r)
			return
		}
		id, err := strconv.ParseInt(strId, 10, 64)

		if err != nil {
			fmt.Println("auth Error", err)
			er.GeneralError(401, "Login to continue")(w, r)
			return
		}
		user, err := q.DB.GetUserByIdWithSettings(r.Context(), id)
		if err != nil {
			fmt.Println("auth Error", err)
			er.GeneralError(401, "Login to continue")(w, r)
			return
		}
		ctx := context.WithValue(r.Context(), "user", user)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})

}
