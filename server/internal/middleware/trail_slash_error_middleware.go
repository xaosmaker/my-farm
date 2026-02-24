package middleware

import (
	"net/http"
	"strings"

	"github.com/xaosmaker/server/internal/apperror"
	"github.com/xaosmaker/server/internal/httpx"
)

func TrailSlashErrorMiddleware(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/") {
			httpx.ServerError(404, httpx.NewErrMessage("Url cannot end on /", apperror.ROUTE_NOT_FOUND, nil))(w, r)
			return
		}

		next.ServeHTTP(w, r)
	})

}
