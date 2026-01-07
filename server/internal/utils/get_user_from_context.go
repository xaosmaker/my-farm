package utils

import (
	"errors"
	"github.com/xaosmaker/server/internal/db"
	"net/http"
)

func GetUserFromContext(r *http.Request) (db.User, error) {
	// Here we asume the user exist from the middleware so the user error
	// will never run
	v := r.Context().Value("user")

	if v != nil {
		user, ok := v.(db.User)
		if !ok {
			return db.User{}, errors.New("Cant cast type user")
		}
		if user.FarmID == nil {
			return user, errors.New("Create a farm before continue")
		}
		return user, nil
	}
	return db.User{}, errors.New("User not found")

}
