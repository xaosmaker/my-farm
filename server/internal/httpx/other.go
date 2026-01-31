package httpx

import (
	"net/http"
	"strconv"

	"github.com/xaosmaker/server/internal/apperror"
)

func GetPathValueToInt64(r *http.Request, valueName string) (int64, ServerErrorResponse) {

	val, err := strconv.ParseInt(r.PathValue(valueName), 10, 64)
	if err != nil {
		return -1, ServerError(400, NewErrMessage("Invalid url param expect number", apperror.INVALID_URL_PARAM, nil))
	}
	return val, nil

}
