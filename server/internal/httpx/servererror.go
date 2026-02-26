package httpx

import (
	"net/http"

	"github.com/xaosmaker/server/internal/apperror"
)

func ServerErrorResponse(appError apperror.AppError) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := WriteJSON(w, appError.StatusCode, sendError{Errors: appError.Errors})
		if err != nil {
			w.WriteHeader(500)

		}

	}
}
