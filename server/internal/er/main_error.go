package er

import (
	"encoding/json"
	"log"
	"net/http"
)

type errorMessageString struct {
	Status int      `json:"status"`
	Errors []string `json:"errors"`
}

type errorMessageMap struct {
	Status int                 `json:"status"`
	Errors []map[string]string `json:"errors"`
}

func FieldErrors(statusCode int, messages map[string]string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		if messages == nil {
			messages = map[string]string{
				"error": "Something went wrong",
			}
		}

		er := errorMessageMap{
			Status: statusCode,
			Errors: []map[string]string{messages},
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
func GeneralError(statusCode int, messages []string) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		if messages == nil {
			messages = []string{
				"Something went wrong",
			}
		}

		er := errorMessageString{
			Status: statusCode,
			Errors: messages,
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
