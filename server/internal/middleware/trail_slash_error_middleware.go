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
			newErr := apperror.AppError{
				StatusCode: 404,
				Err:        nil,
				Severity:   apperror.SEVERITY_WARN,
				Errors: []apperror.ErrorMessage{
					{
						Message: "Url cannot end on /",
						AppCode: apperror.ROUTE_NOT_FOUND,
						Meta:    nil,
					},
				},
			}

			httpx.ServerErrorResponse(newErr)(w, r)
			return
		}

		next.ServeHTTP(w, r)
	})

}
