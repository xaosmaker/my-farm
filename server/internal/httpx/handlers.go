package httpx

import (
	"encoding/json"
	"net/http"

	"github.com/xaosmaker/server/internal/apperror"
)

type sendError struct {
	Errors []apperror.ErrorMessage `json:"errors"`
}

func Handler(fn func(w http.ResponseWriter, r *http.Request) error) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := fn(w, r); err != nil {

			if err, ok := err.(apperror.AppError); ok {

				WriteJSON(w, err.StatusCode, sendError{Errors: err.Errors})
				return

			} else {

				serverError := apperror.New500Error(nil)
				WriteJSON(w, serverError.StatusCode, sendError{Errors: serverError.Errors})
				return
			}

		}

	}
}

func WriteJSON(w http.ResponseWriter, statusCode int, data any) error {
	w.WriteHeader(statusCode)
	w.Header().Set("Content-Type", "application/json")

	return json.NewEncoder(w).Encode(data)
}
