package utils

import (
	"errors"
	"github.com/xaosmaker/server/internal/db"
	"net/http"
)

func GetUserFromContext(r *http.Request) (db.User, error) {
	v := r.Context().Value("user")

	if v != nil {
		user, ok := v.(db.User)
		if !ok {
			return db.User{}, errors.New("Cant cast type user")
		}
		return user, nil
	}
	return db.User{}, errors.New("User is nill")

}
