package httpx

import (
	"encoding/json"
	"net/http"

	"github.com/xaosmaker/server/internal/apperror"
)

func DecodeBody(r *http.Request, s any) error {

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&s)
	if err != nil {
		return err
	}
	return nil

}

func DecodeAndVal(r *http.Request, s any) error {
	DecodeBody(r, s)
	err := apperror.ValidateFields(s)
	if err != nil {
		return apperror.New400Error(err, nil)
	}

	return nil
}
