package httpx

import (
	"fmt"
	"net/http"
	"strconv"
)

func GetPathValueToInt64(r *http.Request, valueName string) (int64, HttpErrorResponse) {

	val, err := strconv.ParseInt(r.PathValue(valueName), 10, 64)
	if err != nil {
		return -1, GeneralError(400, fmt.Sprintf("Cant Convert path value to int: %v", valueName))
	}
	return val, nil

}
