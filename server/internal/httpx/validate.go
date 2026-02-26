package httpx

import (
	"net/http"

	"github.com/xaosmaker/server/internal/apperror"
)

func DecodeAndVal(r *http.Request, s any) error {
	DecodeBody(r, s)
	err := apperror.ValidateFields(s)
	if err != nil {
		return apperror.New400Error(err, nil)
	}

	return nil
}
