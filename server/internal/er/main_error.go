package er

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/xaosmaker/server/internal/utils"
)

type errorMessageString struct {
	Status int `json:"status"`
	Errors any `json:"errors"`
}

func validateMessages(s any) any {

	switch t := s; t.(type) {
	case string:
		if s == "login" {
			return []string{"Login to continue"}
		}
		return []any{s}
	case []string:
		return s
	case utils.FieldErrors:
		return s
	default:
		return []string{"Something Went Wrong"}
	}
}

func GeneralError(statusCode int, messages any) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		var message any
		if statusCode == 500 {
			message = []string{"internal server error"}

		} else {
			message = validateMessages(messages)
		}

		er := errorMessageString{
			Status: statusCode,
			Errors: message,
		}

		w.WriteHeader(statusCode)
		w.Header().Set("content-type", "application/json")
		data, err := json.Marshal(er)
		if err != nil {
			log.Fatal("Cant Marshal General Purpose Error:", err)
		}
		w.Write(data)

	}
}
