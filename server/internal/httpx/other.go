package httpx

import (
	"net/http"
	"strconv"

	"github.com/xaosmaker/server/internal/apperror"
)

func GetPathValToInt(r *http.Request, valueName string) (int64, error) {
	val, err := strconv.ParseInt(r.PathValue(valueName), 10, 64)
	if err != nil {
		return -1, apperror.AppError{
			StatusCode: 400,
			Severity:   apperror.SEVERITY_INFO,
			Errors: []apperror.ErrorMessage{
				{
					Message: "Invalid url param expect number",
					AppCode: apperror.INVALID_URL_PARAM,
					Meta:    nil,
				},
			},
			Err: err,
		}
	}
	return val, nil
}
