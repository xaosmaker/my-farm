package middlewares

import (
	"net/http"
	"strings"

	"github.com/xaosmaker/server/internal/er"
)

func TrailSlashErrorMiddleware(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/") {
			er.GeneralError(400, "Url cannot end on /")(w, r)
			return
		}

		next.ServeHTTP(w, r)
	})

}
