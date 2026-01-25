package httpx

import (
	"encoding/json"
	"net/http"
)

func DecodeBody(r *http.Request, s any) error {

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&s)
	if err != nil {
		return err
	}
	return nil

}

