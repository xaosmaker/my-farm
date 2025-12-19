package auth

import (
	"fmt"
	"net/http"
)

func GetCookie(r *http.Request, name string) (string, error) {
	cookies := r.Cookies()
	for _, cook := range cookies {
		if cook.Name == name {
			return cook.Value, nil
		}
	}
	return "", fmt.Errorf("Cookie not Found")

}
