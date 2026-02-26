package httpx

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/xaosmaker/server/internal/apperror"
)

type Meta = map[string]string

type errorMessage struct {
	Message string            `json:"message"`
	AppCode string            `json:"appCode"`
	Meta    map[string]string `json:"meta"`
}

type ErrMessage struct {
	Errors []errorMessage `json:"errors"`
}

func NewErrMessage(message, appCode string, meta Meta) *ErrMessage {
	return &ErrMessage{
		Errors: []errorMessage{{Message: message, AppCode: appCode, Meta: meta}},
	}
}

func filterStatusCodes(statusCode int, message *ErrMessage) ErrMessage {
	switch statusCode {
	case 500:
		return *NewErrMessage("Internal Server Error", apperror.SERVER_ERROR, nil)
	case 401:
		return *NewErrMessage("Unauthorized", apperror.UNAUTHORIZED_ERROR, nil)
	default:
		if message != nil {
			return *message
		}
		return *NewErrMessage("Unknown code cant determine the server error", apperror.UNKNOWN_ERROR, nil)
	}

}

func ServerErrorResponse(appError apperror.AppError) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := WriteJSON(w, appError.StatusCode, sendError{Errors: appError.Errors})
		if err != nil {
			w.WriteHeader(500)

		}

	}
}

func ServerError(statusCode int, message *ErrMessage) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		m := filterStatusCodes(statusCode, message)

		w.WriteHeader(statusCode)
		messageEnc, err := json.Marshal(m)
		if err != nil {
			fmt.Println(err, "Fail to marsal error")
			return
		}

		w.Write(messageEnc)

	}

}
